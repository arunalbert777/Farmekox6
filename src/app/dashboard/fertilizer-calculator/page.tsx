"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Barcode, Calculator, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/hooks";

type FertilizerInfo = {
  name: string;
  composition: string;
  details: string;
};

const mockDb: { [key: string]: FertilizerInfo } = {
  "123456789": {
    name: "Urea Gold",
    composition: "46% Nitrogen, 17% Sulphur",
    details: "A sulphur-coated urea that improves nitrogen use efficiency and provides essential sulphur to the soil.",
  },
  "987654321": {
    name: "DAP (Di-Ammonium Phosphate)",
    composition: "18% Nitrogen, 46% Phosphorus",
    details: "A popular phosphate fertilizer, providing two key nutrients for plant growth.",
  },
};


export default function FertilizerCalculatorPage() {
  const { t } = useLanguage();
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState<FertilizerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = () => {
    setLoading(true);
    setError(null);
    setResult(null);

    setTimeout(() => {
      const info = mockDb[barcode];
      if (info) {
        setResult(info);
      } else {
        setError("Fertilizer not found. Please check the barcode and try again.");
      }
      setLoading(false);
    }, 1000);
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
          <div className="space-y-2">
            <Label htmlFor="barcode">{t("barcode_number")}</Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter or scan barcode"
              />
              <Button onClick={handleScan} disabled={loading} className="w-full md:w-auto">
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Barcode className="mr-2 size-4" />}
                {t("scan_barcode")}
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
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
