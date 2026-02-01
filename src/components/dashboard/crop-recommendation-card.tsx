"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CropRecommendationCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("crop_recommendation")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <Leaf className="size-16 text-primary/80" />
        <p className="mt-4 text-muted-foreground">Get AI-powered suggestions for the best crops to plant this season.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/crop-recommendation">
            {t("get_recommendation")}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
