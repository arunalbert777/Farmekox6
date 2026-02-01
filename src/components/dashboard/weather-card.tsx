"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudSun, Sun, Cloud, CloudRain, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import Link from "next/link";

const weatherData = [
  { day: "Mon", Icon: CloudSun, temp: "32°" },
  { day: "Tue", Icon: Sun, temp: "34°" },
  { day: "Wed", Icon: CloudRain, temp: "28°" },
  { day: "Thu", Icon: CloudRain, temp: "27°" },
  { day: "Fri", Icon: Cloud, temp: "30°" },
];

export function WeatherForecastCard() {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("weather_forecast")}</CardTitle>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/weather"><RefreshCw className="size-4" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around rounded-lg bg-secondary/50 p-4">
          {weatherData.map(({ day, Icon, temp }) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">{day}</span>
              <Icon className="size-8 text-primary" />
              <span className="font-bold">{temp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
