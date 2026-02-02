"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FertilizerCalculatorCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("fertilizer_calculator")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <Calculator className="size-16 text-primary/80" />
        <p className="mt-4 text-muted-foreground">Scan a barcode to get fertilizer details and dosage.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/fertilizer-calculator">
            Open Calculator
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
