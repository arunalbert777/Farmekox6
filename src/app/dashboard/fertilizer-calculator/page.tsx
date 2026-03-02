"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2, Camera, Send, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import { getFertilizerProductInfo, type FertilizerProductInfo } from "@/ai/flows/fertilizer-recommendation";
import { getPersonalizedFertilizerAdvice } from "@/ai/flows/fertilizer-ai-advice";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";

export default function FertilizerInfoPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  const [barcode, setBarcode] = useState("");
  const [productInfo, setProductInfo] = useState<FertilizerProductInfo | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  
  // Custom Advice Inputs
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [farmSize, setFarmSize] = useState("1");

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Firestore lookup for existing product. 
  // CRITICAL: We depend on 'user' to ensure the listener only starts once authenticated.
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
    setAiAdvice(null);

    try {
      // If we found it in Firestore, use that first
      if (firestoreProduct) {
        setProductInfo({
            productName: firestoreProduct.productName,
            brandName: firestoreProduct.brandName,
            npkComposition: firestoreProduct.npkComposition,
            suitableCrops: firestoreProduct.suitableCropIds || [],
            recommendedSoilType: firestoreProduct.recommendedSoilType,
            manufacturerDetails: firestoreProduct.manufacturerDetails,
            expiryDate: firestoreProduct.expiryDate,
            safetyPrecautions: firestoreProduct.safetyPrecautions,
            usageInstructions: {
                dosagePerAcre: firestoreProduct.recommendedDosagePerAcre,
                mixingInstructions: firestoreProduct.mixingInstructions,
                applicationMethod: firestoreProduct.applicationMethod,
                bestTimeToApply: firestoreProduct.bestTimeToApply,
                safetyMeasures: firestoreProduct.safetyPrecautions
            }
        } as FertilizerProductInfo);
      } else {
        // Fallback to Gemini AI
        const info = await getFertilizerProductInfo({ barcode });
        setProductInfo(info);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not retrieve product information." });
    } finally {
        setLoading(false);
    }
  };

  const handleGetAdvice = async () => {
      if (!productInfo || !cropType || !soilType || !farmSize) {
          toast({ variant: "destructive", title: "Missing Info", description: "Please provide crop, soil type, and farm size." });
          return;
      }
      setAdviceLoading(true);
      try {
          const advice = await getPersonalizedFertilizerAdvice({
              productName: productInfo.productName,
              npkComposition: productInfo.npkComposition,
              cropType,
              soilType,
              farmSizeAcres: parseFloat(farmSize),
              language: language as 'en' | 'kn'
          });
          setAiAdvice(advice.personalizedAdvice);
      } catch (err) {
          toast({ variant: "destructive", title: "AI Error", description: "Failed to generate personalized guidance." });
      } finally {
          setAdviceLoading(false);
      }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 pb-12">
      <div className="text-center mb-6">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <Calculator className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">{t("fertilizer_calculator_title")}</h1>
        <p className="text-muted-foreground">Identify fertilizers and get personalized AI usage guidance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Barcode Scanning</CardTitle>
            <CardDescription>Scan or enter the barcode from your fertilizer bag.</CardDescription>
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
                Identify Product
              </Button>
            </div>
          </CardContent>
        </Card>

        {productInfo && (
          <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-green-600" />
                    <CardTitle className="text-xl">{productInfo.productName}</CardTitle>
                </div>
                <CardDescription>{productInfo.brandName}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground">NPK Ratio</Label>
                        <p className="font-bold text-lg">{productInfo.npkComposition}</p>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-muted-foreground">Expiry Info</Label>
                        <p className="font-medium">{productInfo.expiryDate}</p>
                    </div>
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Suitable Crops</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {productInfo.suitableCrops.map(c => <span key={c} className="bg-secondary px-2 py-0.5 rounded text-xs">{c}</span>)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Manufacturer</Label>
                  <p className="text-sm">{productInfo.manufacturerDetails}</p>
                </div>
                <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="size-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 text-xs font-bold">Safety Precaution</AlertTitle>
                    <AlertDescription className="text-amber-700 text-xs">
                        {productInfo.safetyPrecautions}
                    </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full size-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                    <div><p className="font-semibold text-sm">Dosage</p><p className="text-xs text-muted-foreground">{productInfo.usageInstructions.dosagePerAcre}</p></div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full size-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                    <div><p className="font-semibold text-sm">Mixing</p><p className="text-xs text-muted-foreground">{productInfo.usageInstructions.mixingInstructions}</p></div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full size-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                    <div><p className="font-semibold text-sm">Application</p><p className="text-xs text-muted-foreground">{productInfo.usageInstructions.applicationMethod}</p></div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full size-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
                    <div><p className="font-semibold text-sm">Best Time</p><p className="text-xs text-muted-foreground">{productInfo.usageInstructions.bestTimeToApply}</p></div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full size-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">5</div>
                    <div><p className="font-semibold text-sm">Safety</p><p className="text-xs text-muted-foreground">{productInfo.usageInstructions.safetyMeasures}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    <CardTitle>Real-Time AI Guidance</CardTitle>
                </div>
                <CardDescription>Get custom expert advice for your specific farm conditions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t("crop_type")}</Label>
                    <Input placeholder="e.g. Paddy" value={cropType} onChange={e => setCropType(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("soil_type")}</Label>
                    <Input placeholder="e.g. Black Soil" value={soilType} onChange={e => setSoilType(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("farm_size")}</Label>
                    <Input type="number" placeholder="Acres" value={farmSize} onChange={e => setFarmSize(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleGetAdvice} disabled={adviceLoading}>
                  {adviceLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                  {t("get_ai_advice")}
                </Button>

                {aiAdvice && (
                  <div className="mt-4 p-4 rounded-lg bg-background border border-primary/20 shadow-inner whitespace-pre-wrap text-sm leading-relaxed animate-in fade-in duration-300">
                    {aiAdvice}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
