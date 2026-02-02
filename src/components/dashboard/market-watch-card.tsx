"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/hooks";
import { LineChart } from "lucide-react";
import Link from "next/link";

export function MarketWatchCard() {
  const { t } = useLanguage();
  return (
    <Link href="/dashboard/market-watch" className="block h-full transform transition-transform duration-200 hover:scale-105">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
          <LineChart className="mb-2 size-8 text-primary" />
          <span className="text-sm font-medium">{t("market_watch")}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
