"use client";

import { useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Satellite, Loader2, Info, Activity, Droplets, ShieldAlert, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/hooks";
import { getSatelliteAnalysis, type SatelliteAnalysisOutput } from "@/ai/flows/satellite-analysis";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SatelliteMonitorProps {
  apiKey?: string;
  isProduction: boolean;
}

export function SatelliteMonitor({ apiKey, isProduction }: SatelliteMonitorProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SatelliteAnalysisOutput | null>(null);
  
  // Default to a farm location in Karnataka
  const [position] = useState({ lat: 12.9716, lng: 77.5946 });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await getSatelliteAnalysis({
        lat: position.lat,
        lng: position.lng,
        cropType: "Rice",
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
        <div className="flex items-center justify-center h-[50vh]">
            <p className="text-muted-foreground">Google Maps API key not configured.</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <Satellite className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">{t('satellite_monitoring_title')}</h1>
        <p className="text-muted-foreground">Monitor crop health and soil moisture via 2026 satellite imagery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Satellite View</CardTitle>
            <CardDescription>Select your field on the map for analysis.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative">
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={position}
                defaultZoom={15}
                mapId="farmekox_satellite_map"
                mapTypeId="satellite"
                className="w-full h-full"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
              >
                <AdvancedMarker position={position}>
                  <div className="size-6 bg-primary/40 border-2 border-primary rounded-full animate-pulse" />
                </AdvancedMarker>
              </Map>
            </APIProvider>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
              <Button onClick={handleAnalyze} disabled={loading} className="w-full shadow-2xl h-12 text-lg">
                {loading ? <Loader2 className="mr-2 animate-spin" /> : <Activity className="mr-2" />}
                {loading ? 'Analyzing Imagery...' : 'Analyze Crop Health'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 overflow-y-auto">
          {analysis ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Activity className="size-5 text-primary" />
                        Vegetation Health (NDVI)
                    </CardTitle>
                    <Badge variant={analysis.healthStatus === 'Excellent' ? 'default' : 'secondary'} className="bg-green-100 text-green-800 border-green-200">
                        {analysis.healthStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Chlorophyll Activity</span>
                    <span>{(analysis.ndviValue * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={analysis.ndviValue * 100} className="h-3" />
                  <p className="text-sm text-muted-foreground italic">
                    NDVI Value: <strong>{analysis.ndviValue.toFixed(2)}</strong>. This indicates robust photosynthesis and high canopy density.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <Droplets className="size-6 text-blue-500" />
                    <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Soil Moisture</span>
                    <span className="text-2xl font-bold">{analysis.soilMoisture}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <ShieldAlert className={analysis.pestRisk === 'Low' ? 'text-green-500' : 'text-amber-500'} />
                    <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Pest Risk</span>
                    <span className="text-2xl font-bold">{analysis.pestRisk}</span>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-accent/30 shadow-md">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="size-5 text-accent" />
                    AI Satellite Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-secondary/30 p-4 rounded-lg border border-dashed border-primary/20">
                    <p className="text-sm leading-relaxed text-foreground italic">
                      "{analysis.recommendation}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-secondary/10 rounded-xl border-2 border-dashed border-primary/10">
              <div className="bg-primary/5 p-6 rounded-full mb-4">
                <Info className="size-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-bold text-primary/60">No Data Yet</h3>
              <p className="text-muted-foreground max-w-xs mt-2">
                Click the "Analyze" button to fetch real-time crop health metrics from our 2026 satellite network.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
