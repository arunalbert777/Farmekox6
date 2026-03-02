"use client";

import * as React from "react";
import { format, parseISO, startOfDay, isSameDay, addDays } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Droplets, 
  Bug, 
  Scissors, 
  Sprout,
  Loader2,
  Wand2,
  Info,
  ChevronRight,
  FlaskConical,
  BellRing,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { generateCropSchedule, type CropScheduleOutput } from "@/ai/flows/generate-crop-schedule";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const CROPS = [
  { id: 'wheat', name: 'Wheat' },
  { id: 'rice', name: 'Rice' },
  { id: 'tomato', name: 'Tomato' },
  { id: 'maize', name: 'Maize' },
  { id: 'ragi', name: 'Ragi' },
];

const ACTIVITY_ICONS: Record<string, any> = {
  Fertilization: FlaskConical,
  Irrigation: Droplets,
  Weeding: Scissors,
  Pesticide: Bug,
  Harvesting: Sprout,
};

const ACTIVITY_COLORS: Record<string, string> = {
  Fertilization: "text-blue-500 bg-blue-50 border-blue-200",
  Irrigation: "text-cyan-500 bg-cyan-50 border-cyan-200",
  Weeding: "text-orange-500 bg-orange-50 border-orange-200",
  Pesticide: "text-purple-500 bg-purple-50 border-purple-200",
  Harvesting: "text-green-500 bg-green-50 border-green-200",
};

const GROWTH_STAGES = [
  { name: "Germination", minDays: 0, maxDays: 7, tip: "Keep soil consistently moist but not waterlogged." },
  { name: "Seedling", minDays: 8, maxDays: 21, tip: "Early fertilization with Nitrogen-rich nutrients is key." },
  { name: "Vegetative", minDays: 22, maxDays: 60, tip: "Focus on pest monitoring as foliage increases." },
  { name: "Flowering", minDays: 61, maxDays: 90, tip: "Avoid water stress to prevent flower drop." },
  { name: "Fruit Setting", minDays: 91, maxDays: 120, tip: "Potassium levels should be boosted for quality yield." },
  { name: "Harvesting", minDays: 121, maxDays: 999, tip: "Prepare storage and market linkage 2 weeks prior." },
];

export function CropCalendarClient() {
  const [sowingDate, setSowingDate] = React.useState<Date | undefined>(new Date(2026, 6, 1));
  const [selectedCropId, setSelectedCropId] = React.useState<string>("wheat");
  const [loading, setLoading] = React.useState(false);
  const [schedule, setSchedule] = React.useState<CropScheduleOutput['events']>([]);
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(new Date(2026, 6, 1));

  const handleGenerateSchedule = async () => {
    if (!sowingDate || !selectedCropId) return;
    
    setLoading(true);
    try {
      const cropName = CROPS.find(c => c.id === selectedCropId)?.name || "Crop";
      const result = await generateCropSchedule({
        cropType: cropName,
        sowingDate: format(sowingDate, "yyyy-MM-dd"),
      });
      setSchedule(result.events);
      setSelectedDay(sowingDate);
    } catch (error) {
      console.error("Failed to generate schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentStage = React.useMemo(() => {
    if (!sowingDate || schedule.length === 0) return null;
    const now = new Date(2026, 6, 25); // Simulated date for 2026
    const diffDays = Math.floor((now.getTime() - sowingDate.getTime()) / (1000 * 3600 * 24));
    return GROWTH_STAGES.find(s => diffDays >= s.minDays && diffDays <= s.maxDays) || GROWTH_STAGES[0];
  }, [sowingDate, schedule]);

  const smartAlerts = React.useMemo(() => {
    const now = new Date(2026, 6, 25); // Simulated date
    const tomorrow = addDays(now, 1);
    return schedule.filter(event => isSameDay(parseISO(event.date), tomorrow));
  }, [schedule]);

  const eventDates = React.useMemo(() => {
    return schedule.map(event => parseISO(event.date));
  }, [schedule]);

  const selectedDayEvents = React.useMemo(() => {
    if (!selectedDay) return [];
    return schedule.filter(event => isSameDay(parseISO(event.date), selectedDay));
  }, [selectedDay, schedule]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
      <div className="space-y-6">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Sowing Parameters
            </CardTitle>
            <CardDescription>Setup your 2026 crop cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Crop</Label>
              <Select value={selectedCropId} onValueChange={setSelectedCropId}>
                <SelectTrigger className="h-12 border-primary/20">
                  <SelectValue placeholder="Select Crop" />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sowing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-start text-left font-normal border-primary/20">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {sowingDate ? format(sowingDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={sowingDate}
                    onSelect={setSowingDate}
                    initialFocus
                    defaultMonth={new Date(2026, 6)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleGenerateSchedule} disabled={loading} className="w-full h-12 shadow-md">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {loading ? "Calculating Timeline..." : "Generate AI Schedule"}
            </Button>
          </CardContent>
        </Card>

        {schedule.length > 0 && currentStage && (
          <Card className="border-accent/20 bg-accent/5 animate-in fade-in slide-in-from-left-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  Growth Stage Tracker
                </div>
                <Badge className="bg-accent text-accent-foreground">{currentStage.name}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Progress</span>
                  <span>{((GROWTH_STAGES.indexOf(currentStage) + 1) / GROWTH_STAGES.length * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(GROWTH_STAGES.indexOf(currentStage) + 1) / GROWTH_STAGES.length * 100} className="h-2" />
              </div>
              <div className="bg-white/50 p-3 rounded-lg border border-accent/10">
                <p className="text-xs font-bold uppercase text-accent/80 flex items-center gap-1 mb-1">
                  <Info className="size-3" /> Expert Tip
                </p>
                <p className="text-xs italic text-muted-foreground">{currentStage.tip}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {smartAlerts.length > 0 && (
          <Card className="border-red-200 bg-red-50/50 animate-bounce-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-red-600 flex items-center gap-2">
                <BellRing className="size-4" />
                Smart Alert: Due in 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              {smartAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-md bg-white border border-red-100 shadow-sm">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FlaskConical className="size-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{alert.activityType}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{alert.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="lg:col-span-2 shadow-xl border-primary/10">
        <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-headline">Agricultural Milestones</CardTitle>
            <CardDescription>AI-generated schedule based on your sowing date.</CardDescription>
          </div>
          {schedule.length > 0 && (
            <Badge className="bg-primary text-primary-foreground animate-pulse">2026 Cycle Active</Badge>
          )}
        </CardHeader>
        <CardContent className="p-0 md:p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex justify-center p-4">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{ event: eventDates }}
              modifiersClassNames={{
                event: "bg-primary/20 text-primary font-bold border-2 border-primary/40 rounded-full"
              }}
              className="rounded-md border shadow-sm scale-110 md:scale-125 origin-center"
              defaultMonth={new Date(2026, 6)}
            />
          </div>

          <div className="w-full md:w-80 space-y-4">
            <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-widest px-2">Upcoming Tasks</h3>
            <ScrollArea className="h-[450px] px-2">
              <div className="space-y-3">
                {schedule.length > 0 ? schedule.map((event, idx) => {
                   const Icon = ACTIVITY_ICONS[event.activityType] || Info;
                   const isActive = isSameDay(parseISO(event.date), selectedDay || new Date(0));
                   return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(parseISO(event.date))}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all hover:shadow-lg group flex items-start gap-4",
                        isActive ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card border-border/50"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg shadow-sm", ACTIVITY_COLORS[event.activityType])}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{format(parseISO(event.date), "MMM d, yyyy")}</p>
                          {isActive && <ChevronRight className="size-3 text-primary" />}
                        </div>
                        <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{event.activityType}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{event.description}</p>
                      </div>
                    </button>
                  );
                }) : (
                  <div className="text-center py-20 opacity-40">
                    <CalendarIcon className="size-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm font-medium">Select a crop and date to see your AI-driven timeline.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}