"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Leaf,
  Calendar,
  CloudSun,
  Calculator,
  LineChart,
  BotMessageSquare,
  UserSquare,
  Map,
} from "lucide-react";
import { useLanguage } from '@/lib/hooks';

export default function DashboardPage() {
  const { t } = useLanguage();

  const features = [
    {
      href: "/dashboard/crop-recommendation",
      icon: Leaf,
      labelKey: "crop_recommendation" as const,
      description: "Get AI-powered crop suggestions for your location and season.",
    },
    {
      href: "/dashboard/crop-calendar",
      icon: Calendar,
      labelKey: "crop_calendar" as const,
      description: "Track and manage your farming activities and schedules.",
    },
    {
      href: "/dashboard/weather",
      icon: CloudSun,
      labelKey: "weather_forecast" as const,
      description: "View forecasts and get smart irrigation advice.",
    },
    {
      href: "/dashboard/fertilizer-calculator",
      icon: Calculator,
      labelKey: "fertilizer_calculator" as const,
      description: "Calculate fertilizer dosage and get product details.",
    },
    {
      href: "/dashboard/market-watch",
      icon: LineChart,
      labelKey: "market_watch" as const,
      description: "Stay updated with agricultural news and mandi prices.",
    },
    {
      href: "/dashboard/ai-advisory",
      icon: BotMessageSquare,
      labelKey: "ai_advisory" as const,
      description: "Get instant answers to your farming questions via chat.",
    },
    {
      href: "/dashboard/ask-expert",
      icon: UserSquare,
      labelKey: "ask_expert" as const,
      description: "Connect with agricultural experts for personalized advice.",
    },
    {
      href: "/dashboard/resources",
      icon: Map,
      labelKey: "resources" as const,
      description: "Find nearby seed stores, fertilizer shops, and mandis.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl">{t("welcome_back")}</h1>
        <p className="text-muted-foreground">{t("smart_crop_advisory")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="block hover:no-underline group">
            <Card className="h-full group-hover:border-primary/80 group-hover:shadow-md transition-all duration-200">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-lg mt-1">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t(feature.labelKey)}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
