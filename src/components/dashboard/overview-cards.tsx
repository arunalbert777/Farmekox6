"use client";

import { useLanguage } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Leaf, Droplets, Wheat } from "lucide-react";

export function OverviewCards() {
  const { t } = useLanguage();

  const overviewItems = [
    {
      title: "Next Calendar Event",
      value: "Fertilize Wheat",
      icon: Calendar,
      description: "Tomorrow, 8:00 AM",
    },
    {
      title: "Recommended Crop",
      value: "Maize",
      icon: Leaf,
      description: "For current season",
    },
    {
      title: "Irrigation Status",
      value: "Skip Today",
      icon: Droplets,
      description: "Rain expected",
    },
    {
      title: "Mandi Price (Wheat)",
      value: "₹2,350 /q",
      icon: Wheat,
      description: "+2.5% from yesterday",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-headline text-3xl md:text-4xl">{t("welcome_back")}</h1>
        <p className="text-muted-foreground">{t("smart_crop_advisory")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewItems.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
