"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CropCalendarCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("crop_calendar")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <Calendar className="size-16 text-primary/80" />
        <p className="mt-4 text-muted-foreground">View your personalized guide for all farming activities.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/crop-calendar">
            View Calendar
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
