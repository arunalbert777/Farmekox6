"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/hooks";
import { BotMessageSquare } from "lucide-react";
import Link from "next/link";

export function AIChatCard() {
  const { t } = useLanguage();
  return (
    <Link href="/dashboard/ai-advisory" className="block h-full transform transition-transform duration-200 hover:scale-105">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
          <BotMessageSquare className="mb-2 size-8 text-primary" />
          <span className="text-sm font-medium">{t("ai_advisory")}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
