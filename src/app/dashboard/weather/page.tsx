import { CloudSun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherClient } from "@/components/dashboard/weather-client";

export default function WeatherPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <CloudSun className="size-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Weather & Irrigation</CardTitle>
          <CardDescription>
            Plan your activities with accurate forecasts and smart irrigation advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeatherClient />
        </CardContent>
      </Card>
    </div>
  );
}
