"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2, Camera, Send, AlertCircle, CheckCircle2, FlaskConical, Droplets, Clock, ShieldCheck, Scale } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import { getFertilizerProductInfo, type FertilizerProductInfo } from "@/ai/flows/fertilizer-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";

export default function FertilizerInfoPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  const [barcode, setBarcode] = useState("");
  const [productInfo, setProductInfo] = useState<FertilizerProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Firestore lookup for existing product metadata
  const productRef = useMemoFirebase(() => {
    if (!db || !barcode || !user) return null;
    return doc(db, 'fertilizer_products', barcode);
  }, [db, barcode, user]);
  
  const { data: firestoreProduct, isLoading: isLookupLoading } = useDoc(productRef);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
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
    if (!barcode) {
        toast({ variant: "destructive", title: "Missing Input", description: "Please enter a barcode number." });
        return;
    }
    setLoading(true);
    setProductInfo(null);

    try {
      // If we found it in Firestore, we could use it, but the user requested Gemini "realtime" info
      // We'll prioritize Gemini to ensure the detailed structured response matches requirements
      const info = await getFertilizerProductInfo({ barcode });
      setProductInfo(info);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not identify this fertilizer barcode." });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 pb-12">
      <div className="text-center mb-6">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <Calculator className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">{t("fertilizer_calculator_title")}</h1>
        <p className="text-muted-foreground">Identify fertilizers via barcode and get expert usage steps.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Barcode Search</CardTitle>
            <CardDescription>Scan a barcode or enter the number from the fertilizer bag.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCameraOpen && (
              <div className="space-y-2 relative">
                  <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted object-cover" autoPlay muted playsInline />
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-md pointer-events-none flex items-center justify-center">
                      <div className="w-3/4 h-1 bg-primary/30 animate-pulse" />
                  </div>
                  {hasCameraPermission === false && (
                      <Alert variant="destructive">
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>Please enable camera permissions in settings.</AlertDescription>
                      </Alert>
                  )}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="barcode">{t("barcode_number")}</Label>
                <div className="flex gap-2">
                    <Input
                        id="barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="e.g., 890123456789"
                        className="flex-1"
                    />
                    <Button onClick={handleToggleCamera} variant="outline" size="icon">
                        <Camera className="size-5" />
                    </Button>
                </div>
              </div>
              <Button onClick={handleFetchProduct} disabled={loading || isLookupLoading} className="w-full">
                {loading || isLookupLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
                Get Product Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {productInfo && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-6 text-green-600" />
                    <CardTitle className="text-2xl">{productInfo.productName}</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium">{productInfo.brandName}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">NPK Composition</Label>
                        <p className="font-bold text-xl text-primary">{productInfo.npkComposition}</p>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Expiry Date</Label>
                        <p className="font-medium">{productInfo.expiryDate}</p>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Suitable Crops</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {productInfo.suitableCrops.map(c => (
                                <span key={c} className="bg-primary/10 text-primary-foreground text-primary px-2 py-0.5 rounded text-xs border border-primary/20">{c}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Recommended Soil</Label>
                        <p className="text-sm">{productInfo.recommendedSoilType}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="text-xs uppercase text-muted-foreground font-bold">Manufacturer Details</Label>
                        <p className="text-sm">{productInfo.manufacturerDetails}</p>
                    </div>
                </div>

                <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="size-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 text-sm font-bold">Safety Precautions</AlertTitle>
                    <AlertDescription className="text-amber-700 text-xs mt-1">
                        {productInfo.safetyPrecautions}
                    </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-accent/30 shadow-md">
              <CardHeader className="bg-accent/5 border-b">
                <CardTitle className="text-xl">Step-by-Step Usage Instructions</CardTitle>
                <CardDescription>Follow these steps for optimal results.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm">1</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Scale className="size-4 text-primary" />
                            <p className="font-bold text-base">Step 1: Recommended Dosage</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.dosagePerAcre}</p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm">2</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FlaskConical className="size-4 text-primary" />
                            <p className="font-bold text-base">Step 2: Mixing Instructions</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.mixingInstructions}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm">3</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Droplets className="size-4 text-primary" />
                            <p className="font-bold text-base">Step 3: Application Method</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.applicationMethod}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm">4</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-primary" />
                            <p className="font-bold text-base">Step 4: Best Time to Apply</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{productInfo.usageInstructions.bestTimeToApply}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold shadow-sm">5</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-primary" />
                            <p className="font-bold text-base">Step 5: Safety Measures</p>
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
