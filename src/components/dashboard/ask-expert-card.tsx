"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/hooks";
import { UserSquare } from "lucide-react";
import Link from "next/link";

export function AskExpertCard() {
  const { t } = useLanguage();
  return (
    <Link href="/dashboard/ask-expert" className="block h-full transform transition-transform duration-200 hover:scale-105">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
          <UserSquare className="mb-2 size-8 text-primary" />
          <span className="text-sm font-medium">{t("ask_expert")}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
