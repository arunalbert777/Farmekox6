"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { BotMessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AIChatCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ai_advisory")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <BotMessageSquare className="size-16 text-primary/80" />
        <p className="mt-4 text-muted-foreground">Ask questions and get instant farming advice in English or Kannada.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/ai-advisory">
            Start Chatting
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
