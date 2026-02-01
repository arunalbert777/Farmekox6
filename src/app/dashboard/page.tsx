"use client";

import { AIChatCard } from "@/components/dashboard/ai-chat-card";
import { CropRecommendationCard } from "@/components/dashboard/crop-recommendation-card";
import { MarketWatchCard } from "@/components/dashboard/market-watch-card";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { WeatherForecastCard } from "@/components/dashboard/weather-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <OverviewCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeatherForecastCard />
        <CropRecommendationCard />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MarketWatchCard />
        <AIChatCard />
      </div>
    </div>
  );
}
