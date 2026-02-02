"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { UserSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AskExpertCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ask_expert")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <UserSquare className="size-16 text-primary/80" />
        <p className="mt-4 text-muted-foreground">Connect with agricultural experts for personalized advice.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/ask-expert">
            Find an Expert
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
