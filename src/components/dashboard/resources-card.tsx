"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { Map, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ResourcesCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("resources")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <Map className="size-16 text-primary/80" />
        <p className="mt-4 text-muted-foreground">Find seed stores, fertilizer shops, and mandis near you.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/resources">
            Find Resources
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
