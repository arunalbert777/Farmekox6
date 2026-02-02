"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks";
import { translations } from "@/lib/translations";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, User } from "lucide-react";

export function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return t("dashboard_title");
      case "/dashboard/crop-recommendation":
        return t("crop_recommendation_title");
      case "/dashboard/crop-calendar":
        return t("crop_calendar_title");
      case "/dashboard/weather":
        return t("weather_forecast_title");
      case "/dashboard/fertilizer-calculator":
        return t("fertilizer_calculator_title");
      case "/dashboard/market-watch":
        return t("market_watch_title");
      case "/dashboard/ai-advisory":
        return t("ai_advisory_title");
      case "/dashboard/ask-expert":
        return t("ask_expert_title");
      case "/dashboard/resources":
        return t("resources_title");
      case "/dashboard/direct-sales":
        return t("direct_sales_title");
      default:
        return t("farmekox");
    }
  };
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-2 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 font-headline text-xl md:text-2xl">{getPageTitle()}</h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
          <Languages className="size-5" />
          <span className="sr-only">Toggle Language</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="size-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
