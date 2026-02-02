"use client";

import { AIChatCard } from "@/components/dashboard/ai-chat-card";
import { AskExpertCard } from "@/components/dashboard/ask-expert-card";
import { CropCalendarCard } from "@/components/dashboard/crop-calendar-card";
import { CropRecommendationCard } from "@/components/dashboard/crop-recommendation-card";
import { DirectSalesCard } from "@/components/dashboard/direct-sales-card";
import { FertilizerCalculatorCard } from "@/components/dashboard/fertilizer-calculator-card";
import { MarketWatchCard } from "@/components/dashboard/market-watch-card";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { ResourcesCard } from "@/components/dashboard/resources-card";
import { WeatherForecastCard } from "@/components/dashboard/weather-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <OverviewCards />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <CropRecommendationCard />
        <CropCalendarCard />
        <WeatherForecastCard />
        <FertilizerCalculatorCard />
        <MarketWatchCard />
        <AIChatCard />
        <AskExpertCard />
        <ResourcesCard />
        <DirectSalesCard />
      </div>
    </div>
  );
}
