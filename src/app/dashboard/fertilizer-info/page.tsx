"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, Send, AlertCircle, CheckCircle2, FlaskConical, Droplets, Clock, ShieldCheck, Scale, X, QrCode } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import { getFertilizerProductInfo, type FertilizerProductInfo } from "@/ai/flows/fertilizer-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FertilizerInfoPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [barcode, setBarcode] = useState("");
  const [productInfo, setProductInfo] = useState<FertilizerProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
        setHasCameraPermission(false);
        return;
    }
    try {
      // Forcing the BACK camera for scanning
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { exact: 'environment' } } 
      }).catch(async () => {
          // Fallback if 'exact' is not supported by the hardware/browser
          return await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      });
      
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setHasCameraPermission(false);
    }
  };

  const handleToggleCamera = () => {
      if (isCameraOpen) {
          setIsCameraOpen(false);
          if (videoRef.current && videoRef.current.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach(track => track.stop());
              videoRef.current.srcObject = null;
          }
      } else {
          setIsCameraOpen(true);
          getCameraPermission();
      }
  }

  const handleFetchProduct = async () => {
    const trimmedBarcode = barcode.trim();
    if (!trimmedBarcode) {
        toast({ variant: "destructive", title: "Input Required", description: "Please enter or scan a barcode/QR code." });
        return;
    }
    
    setLoading(true);
    setProductInfo(null);

    try {
      // Real-time AI identification, bypassing Firestore
      const info = await getFertilizerProductInfo({ barcode: trimmedBarcode });
      setProductInfo(info);
      if (isCameraOpen) handleToggleCamera();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Identification Error", description: "Could not identify this code. Please try again." });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 pb-12">
      <div className="text-center mb-6">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <QrCode className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">{t("fertilizer_info_title")}</h1>
        <p className="text-muted-foreground">Scan QR codes, EAN-13 barcodes, or HSN codes for instant product info.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Identification</CardTitle>
            <CardDescription>Enter any EAN, UPC, HSN, or QR code content for real-time identification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCameraOpen && (
              <div className="space-y-2 relative group bg-black rounded-md overflow-hidden">
                  <video ref={videoRef} className="w-full aspect-video object-cover" autoPlay muted playsInline />
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-md pointer-events-none flex items-center justify-center">
                      <div className="w-3/4 h-0.5 bg-primary/40 animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 rounded-full shadow-lg"
                    onClick={handleToggleCamera}
                  >
                    <X className="size-4" />
                  </Button>
                  {hasCameraPermission === false && (
                      <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/60">
                          <Alert variant="destructive" className="max-w-xs">
                              <AlertTitle>Camera Access Required</AlertTitle>
                              <AlertDescription>Please enable camera permissions in settings to use the scanner.</AlertDescription>
                          </Alert>
                      </div>
                  )}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="barcode">Barcode / QR / HSN Code</Label>
                <div className="flex gap-2">
                    <Input
                        id="barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Scan or enter code (e.g., 8901138815943)"
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleFetchProduct()}
                    />
                    <Button onClick={handleToggleCamera} variant={isCameraOpen ? "secondary" : "outline"} size="icon">
                        <Camera className="size-5" />
                    </Button>
                </div>
              </div>
              <Button onClick={handleFetchProduct} disabled={loading} className="w-full h-12 text-lg">
                {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Send className="mr-2 size-5" />}
                {loading ? 'Identifying...' : 'Get Product Info'}
              </Button>
            </div>
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
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Expiry / Batch Info</Label>
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
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Recommended Soil</Label>
                        <p className="text-sm font-medium">{productInfo.recommendedSoilType}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Manufacturer Details</Label>
                        <p className="text-sm">{productInfo.manufacturerDetails}</p>
                    </div>
                </div>

                <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="size-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 text-sm font-bold">Safety Precautions</AlertTitle>
                    <AlertDescription className="text-amber-700 text-xs mt-1 leading-relaxed">
                        {productInfo.safetyPrecautions}
                    </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-accent/30 shadow-md">
              <CardHeader className="bg-accent/5 border-b">
                <CardTitle className="text-xl">Step-by-Step Usage Instructions</CardTitle>
                <CardDescription>Tailored instructions for effective results.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-4 group">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110">1</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Scale className="size-4 text-primary" />
                            <p className="font-bold text-base text-foreground">Step 1: Dosage / Serving</p>
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
                            <p className="font-bold text-base text-foreground">Step 4: Best Time to Use</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.bestTimeToApply}</p>
                    </div>
                </div>

                <div className="flex gap-4 group">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110">5</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-primary" />
                            <p className="font-bold text-base text-foreground">Step 5: Safety During Use</p>
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