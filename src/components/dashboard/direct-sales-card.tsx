"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { Store, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DirectSalesCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("direct_sales")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <Store className="size-16 text-primary/80" />
        <p className="mt-4 text-muted-foreground">Buy and sell produce directly from local farms.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/direct-sales">
            Go to Market
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
