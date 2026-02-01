"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCropRecommendation, type CropRecommendationOutput } from "@/ai/flows/crop-recommendation";
import { useLanguage } from "@/lib/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
  season: z.enum(["Spring", "Summer", "Autumn", "Winter"]),
  climaticConditions: z.string().min(5, "Please describe the climate."),
});

type FormValues = z.infer<typeof formSchema>;

export function CropRecommendationForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      season: "Summer",
      climaticConditions: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const recommendation = await getCropRecommendation(values);
      setResult(recommendation);
    } catch (e) {
      setError("Failed to get recommendation. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("location")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enter_location")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("season")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spring">{t("spring")}</SelectItem>
                      <SelectItem value="Summer">{t("summer")}</SelectItem>
                      <SelectItem value="Autumn">{t("autumn")}</SelectItem>
                      <SelectItem value="Winter">{t("winter")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="climaticConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("climate_conditions")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter_climate")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 size-4" />
            )}
            {t("get_recommendation")}
          </Button>
        </form>
      </Form>

      {error && <p className="text-center text-destructive">{error}</p>}

      {result && (
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold">Recommended Crops:</h3>
              <ul className="list-disc pl-5">
                {result.recommendedCrops.map((crop) => (
                  <li key={crop}>{crop}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Reasoning:</h3>
              <p className="text-muted-foreground">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
