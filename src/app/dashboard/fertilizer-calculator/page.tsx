"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Barcode, Calculator, Loader2, Camera, Send } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import { getFertilizerRecommendation, type FertilizerRecommendationOutput } from "@/ai/flows/fertilizer-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function FertilizerCalculatorPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState<FertilizerRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    // Cleanup stream on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
        toast({
            variant: "destructive",
            title: "Unsupported",
            description: "Camera access is not supported on this device/browser.",
        });
        setHasCameraPermission(false);
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        description: 'Please enable camera permissions in your browser settings to use this app.',
      });
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

  const handleSubmit = async () => {
    if (!barcode) {
        setError("Please enter a barcode number.");
        return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const info = await getFertilizerRecommendation({ barcode });
      setResult(info);
    } catch (err: any) {
      setError(err.message || "Fertilizer not found. Please check the barcode and try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Calculator className="size-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">{t("fertilizer_calculator_title")}</CardTitle>
          <CardDescription>
            Scan a fertilizer barcode to get its details and recommended dosage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {isCameraOpen && (
            <div className="space-y-2">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature. You might need to refresh the page and try again.
                        </AlertDescription>
                    </Alert>
                )}
                 <Alert>
                    <Barcode className="h-4 w-4" />
                    <AlertTitle>Manual Entry Required</AlertTitle>
                    <AlertDescription>
                        Automatic barcode scanning is not yet available. Please view the barcode with your camera and type the number below.
                    </AlertDescription>
                 </Alert>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="barcode">{t("barcode_number")}</Label>
            <div className="flex flex-wrap gap-2">
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter barcode manually"
                className="flex-1 min-w-[150px]"
              />
              <Button onClick={handleToggleCamera} variant="outline">
                  <Camera className="mr-2 size-4"/>
                  {isCameraOpen ? "Close Camera" : "Scan with Camera"}
              </Button>
              <Button onClick={handleSubmit} disabled={loading} >
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
                Get Details
              </Button>
            </div>
          </div>

          {error && <p className="text-center text-destructive">{error}</p>}
          
          {result && (
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle>{result.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Composition</h4>
                  <p className="text-muted-foreground">{result.composition}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Details</h4>
                  <p className="text-muted-foreground">{result.details}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Recommended Dosage</h4>
                  <p className="text-muted-foreground">{result.dosage}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Usage Instructions</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {result.usageInstructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
