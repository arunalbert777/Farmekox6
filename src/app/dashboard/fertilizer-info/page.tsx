
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, Send, AlertCircle, CheckCircle2, FlaskConical, Droplets, Clock, ShieldCheck, Scale, X, QrCode, ScanLine } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import { getFertilizerProductInfo, type FertilizerProductInfo } from "@/ai/flows/fertilizer-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Html5Qrcode } from "html5-qrcode";

export default function FertilizerInfoPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [barcode, setBarcode] = useState("");
  const [productInfo, setProductInfo] = useState<FertilizerProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const SCANNER_ID = "reader";

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = html5QrCode;

      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0 
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Success: stop scanner and process result
          setBarcode(decodedText);
          handleToggleCamera(); // Stop camera
          handleFetchProduct(decodedText); // Auto-fetch
          toast({ title: "Code Scanned", description: `Detected: ${decodedText}` });
        },
        () => {
          // Scan fail: quiet fail, just keep scanning
        }
      );
      setHasCameraPermission(true);
    } catch (err) {
      console.error("Scanner start failed:", err);
      setHasCameraPermission(false);
      toast({ 
        variant: "destructive", 
        title: "Camera Error", 
        description: "Could not access the camera. Please check permissions." 
      });
      setIsCameraOpen(false);
    }
  };

  const handleToggleCamera = () => {
    if (isCameraOpen) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current = null;
          setIsCameraOpen(false);
        }).catch(err => {
          console.error("Stop failed", err);
          setIsCameraOpen(false);
        });
      } else {
        setIsCameraOpen(false);
      }
    } else {
      setIsCameraOpen(true);
      // Wait for DOM to render the scanner div
      setTimeout(startScanner, 100);
    }
  };

  const handleFetchProduct = async (scannedCode?: string) => {
    const codeToUse = scannedCode || barcode.trim();
    if (!codeToUse) {
      toast({ 
        variant: "destructive", 
        title: "Input Required", 
        description: "Please enter or scan a barcode/QR code." 
      });
      return;
    }
    
    setLoading(true);
    setProductInfo(null);

    try {
      const info = await getFertilizerProductInfo({ barcode: codeToUse });
      setProductInfo(info);
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Identification Error", 
        description: "Could not identify this code. Please try again." 
      });
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
        <p className="text-muted-foreground">Scan QR codes or barcodes for instant product profiles and usage guides.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Identification</CardTitle>
            <CardDescription>Use the scanner for barcodes/QR or enter the code manually below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCameraOpen && (
              <div className="space-y-2 relative group bg-black rounded-md overflow-hidden min-h-[300px] flex flex-col">
                  <div id={SCANNER_ID} className="w-full flex-1" />
                  <div className="absolute top-2 right-2 z-10">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="rounded-full shadow-lg"
                      onClick={handleToggleCamera}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/60 z-20">
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
                <Label htmlFor="barcode">Manual Entry / Scanned Result</Label>
                <div className="flex gap-2">
                    <Input
                        id="barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Scan or enter code (e.g., 8901138815943)"
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleFetchProduct()}
                    />
                    <Button 
                      onClick={handleToggleCamera} 
                      variant={isCameraOpen ? "secondary" : "outline"} 
                      size="icon"
                      className={isCameraOpen ? "animate-pulse border-primary" : ""}
                    >
                        {isCameraOpen ? <ScanLine className="size-5 text-primary" /> : <Camera className="size-5" />}
                    </Button>
                </div>
              </div>
              <Button onClick={() => handleFetchProduct()} disabled={loading} className="w-full h-12 text-lg">
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
