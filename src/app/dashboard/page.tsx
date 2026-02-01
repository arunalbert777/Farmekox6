import { OverviewCards } from "@/components/dashboard/overview-cards";
import { WeatherForecastCard } from "@/components/dashboard/weather-card";
import { CropRecommendationCard } from "@/components/dashboard/crop-recommendation-card";
import { MarketWatchCard } from "@/components/dashboard/market-watch-card";
import { AIChatCard } from "@/components/dashboard/ai-chat-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <OverviewCards />
      <div className="grid gap-8 lg:grid-cols-2">
        <WeatherForecastCard />
        <CropRecommendationCard />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <MarketWatchCard />
        <AIChatCard />
      </div>
    </div>
  );
}
