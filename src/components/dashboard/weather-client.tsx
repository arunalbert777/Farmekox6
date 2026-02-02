"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { rainAlertIrrigationAdvice, type RainAlertIrrigationAdviceOutput } from "@/ai/flows/rain-alert-irrigation-advice";
import { useLanguage } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCw, Sun, Cloud, CloudRain, Droplets, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
  cropType: z.string().min(2, "Crop type is required."),
});

type FormValues = z.infer<typeof formSchema>;

const initialForecast = [
  { day: "Today", date: "2024-07-22", chanceOfRain: 10, temp: 32, Icon: Sun },
  { day: "Tue", date: "2024-07-23", chanceOfRain: 20, temp: 33, Icon: Cloud },
  { day: "Wed", date: "2024-07-24", chanceOfRain: 60, temp: 29, Icon: CloudRain },
  { day: "Thu", date: "2024-07-25", chanceOfRain: 70, temp: 28, Icon: CloudRain },
  { day: "Fri", date: "2024-07-26", chanceOfRain: 10, temp: 31, Icon: Cloud },
  { day: "Sat", date: "2024-07-27", chanceOfRain: 5, temp: 34, Icon: Sun },
  { day: "Sun", date: "2024-07-28", chanceOfRain: 5, temp: 34, Icon: Sun },
];

export function WeatherClient() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [forecast, setForecast] = useState(initialForecast);
  const [adviceResult, setAdviceResult] = useState<RainAlertIrrigationAdviceOutput | null>(null);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { location: "Bengaluru", cropType: "Rice" },
  });

  const handleRefresh = () => {
    startTransition(() => {
      // In a real app, you'd fetch new weather data here.
      // For now, we'll just shuffle the icons for a visual effect.
      const shuffled = [...forecast].sort(() => Math.random() - 0.5);
      setForecast(shuffled);
    });
  };

  const onSubmit = async (values: FormValues) => {
    startTransition(() => {
      setAdviceResult(null);
      setAdviceError(null);
      rainAlertIrrigationAdvice(values)
        .then(setAdviceResult)
        .catch(() => setAdviceError("Failed to get advice. Please try again."));
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("weather_forecast_title")}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            </Button>
          </div>
          <CardDescription>For Bengaluru, India</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4">
                    {forecast.map((day, index) => (
                        <div key={index} className="p-4 rounded-lg bg-secondary/50 flex flex-col items-center gap-2 text-center min-w-[100px]">
                        <p className="font-bold">{day.day}</p>
                        <day.Icon className="size-8 text-primary" />
                        <p className="font-semibold">{day.temp}°C</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Droplets className="size-3" />
                            <span>{day.chanceOfRain}%</span>
                        </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Rain Alert & Irrigation Advice</CardTitle>
          <CardDescription>Get AI advice on whether to skip irrigation based on the forecast.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("location")}</FormLabel>
                    <FormControl><Input placeholder={t("enter_location")} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cropType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("crop_type")}</FormLabel>
                    <FormControl><Input placeholder={t("enter_crop_type")} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                {t("get_irrigation_advice")}
              </Button>
            </form>
          </Form>

          {adviceResult && (
            <Alert className="mt-6 border-primary bg-primary/5">
              <Info className="size-4 text-primary"/>
              <AlertTitle className="text-primary">AI Irrigation Advice</AlertTitle>
              <AlertDescription>{adviceResult.advice}</AlertDescription>
            </Alert>
          )}
          {adviceError && <p className="mt-4 text-center text-destructive">{adviceError}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
