"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, Send, AlertCircle, CheckCircle2, FlaskConical, Droplets, Clock, ShieldCheck, Scale, X, CameraIcon, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import { getFertilizerProductInfo, type FertilizerProductInfo } from "@/ai/flows/fertilizer-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

export default function FertilizerInfoPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<FertilizerProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
          });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
          setIsCameraOpen(false);
        }
      };
      getCameraPermission();
    } else {
      // Stop camera stream when closing
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        setIsCameraOpen(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    
    setLoading(true);
    setProductInfo(null);

    try {
      const info = await getFertilizerProductInfo({ photoDataUri: capturedImage });
      setProductInfo(info);
      toast({ title: "Analysis Complete", description: "Product successfully identified." });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Identification Error", 
        description: "Could not identify the product from the image. Please try a clearer photo." 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setProductInfo(null);
    setIsCameraOpen(true);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 pb-12">
      <div className="text-center mb-6">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <CameraIcon className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">AI Vision: Product Identification</h1>
        <p className="text-muted-foreground">Take a photo of any fertilizer or agricultural product for instant expert guidance.</p>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden border-primary/20">
          <CardHeader>
            <CardTitle>Capture Product Photo</CardTitle>
            <CardDescription>Ensure the brand and details are clearly visible in the frame.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-video rounded-lg bg-black overflow-hidden shadow-inner flex items-center justify-center">
              {isCameraOpen ? (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                    <Button onClick={handleCapture} className="rounded-full h-16 w-16 bg-white hover:bg-white/90 border-4 border-primary/50 text-primary">
                      <Camera className="size-8" />
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-full h-10 w-10" onClick={() => setIsCameraOpen(false)}>
                      <X className="size-5" />
                    </Button>
                  </div>
                </>
              ) : capturedImage ? (
                <div className="relative w-full h-full">
                  <Image src={capturedImage} alt="Captured product" fill className="object-cover" />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button onClick={resetCapture} variant="secondary" className="shadow-lg">
                      <RefreshCcw className="mr-2 size-4" /> Retake
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-white/50">
                  <CameraIcon className="size-16 opacity-20" />
                  <Button onClick={() => setIsCameraOpen(true)} className="h-12 px-8">
                    Open Camera
                  </Button>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use the AI vision features.
                </AlertDescription>
              </Alert>
            )}

            {capturedImage && !productInfo && (
              <Button onClick={handleAnalyze} disabled={loading} className="w-full h-12 text-lg shadow-lg">
                {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Send className="mr-2 size-5" />}
                {loading ? 'Analyzing Product...' : 'Analyze Product Image'}
              </Button>
            )}
          </CardContent>
        </Card>

        {productInfo && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-primary/20 shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-6 text-green-600" />
                    <CardTitle className="text-2xl">{productInfo.productName}</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium text-primary/80">{productInfo.brandName}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">NPK Composition</Label>
                        <p className="font-bold text-xl text-primary">{productInfo.npkComposition}</p>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Estimated Expiry</Label>
                        <p className="font-medium">{productInfo.expiryDate}</p>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Suitable Crops</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {productInfo.suitableCrops.map(c => (
                                <span key={c} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs border border-primary/20">{c}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Recommended Environment</Label>
                        <p className="text-sm font-medium">{productInfo.recommendedSoilType}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Manufacturer Info</Label>
                        <p className="text-sm">{productInfo.manufacturerDetails}</p>
                    </div>
                </div>

                <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="size-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 text-sm font-bold">Expert Safety Precautions</AlertTitle>
                    <AlertDescription className="text-amber-700 text-xs mt-1 leading-relaxed">
                        {productInfo.safetyPrecautions}
                    </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-accent/30 shadow-md">
              <CardHeader className="bg-accent/5 border-b">
                <CardTitle className="text-xl">Step-by-Step Usage Guide</CardTitle>
                <CardDescription>AI-generated instructions based on the identified product.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-4 group">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110">1</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Scale className="size-4 text-primary" />
                            <p className="font-bold text-base text-foreground">Step 1: Dosage / Amount</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.dosagePerAcre}</p>
                    </div>
                </div>
                
                <div className="flex gap-4 group">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110">2</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FlaskConical className="size-4 text-primary" />
                            <p className="font-bold text-base text-foreground">Step 2: Mixing / Preparation</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.mixingInstructions}</p>
                    </div>
                </div>

                <div className="flex gap-4 group">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110">3</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Droplets className="size-4 text-primary" />
                            <p className="font-bold text-base text-foreground">Step 3: Application Method</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.applicationMethod}</p>
                    </div>
                </div>

                <div className="flex gap-4 group">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110">4</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-primary" />
                            <p className="font-bold text-base text-foreground">Step 4: Optimal Timing</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.bestTimeToApply}</p>
                    </div>
                </div>

                <div className="flex gap-4 group">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110">5</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-primary" />
                            <p className="font-bold text-base text-foreground">Step 5: Safety Measures</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.safetyMeasures}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
