
"use client";

import * as React from "react";
import { format, addDays, differenceInDays, isBefore, isAfter, startOfDay } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Sprout,
  Leaf,
  Flower2,
  Apple,
  Scissors,
  Droplets,
  Bug,
  AlertCircle,
  Clock,
  ChevronRight,
  Info
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Growth Stage Definitions
const CROP_STAGES = [
  { id: 'germination', label: 'Germination', icon: Sprout, startDay: 0, endDay: 7, tip: "Keep soil consistently moist but not waterlogged." },
  { id: 'seedling', label: 'Seedling', icon: Sprout, startDay: 8, endDay: 21, tip: "Monitor for early-stage pests and ensure adequate sunlight." },
  { id: 'vegetative', label: 'Vegetative', icon: Leaf, startDay: 22, endDay: 60, tip: "Apply nitrogen-rich fertilizer to support leaf and stem growth." },
  { id: 'flowering', label: 'Flowering', icon: Flower2, startDay: 61, endDay: 90, tip: "Consistent moisture is critical to prevent flower drop." },
  { id: 'fruiting', label: 'Fruit Setting', icon: Apple, startDay: 91, endDay: 110, tip: "Support plants if fruit is heavy; ensure potassium-rich nutrients." },
  { id: 'harvesting', label: 'Harvesting', icon: Scissors, startDay: 111, endDay: 130, tip: "Reduce watering to improve flavor and shelf-life before picking." },
];

const CROPS = [
  { id: 'wheat', name: 'Wheat', cycleDays: 120 },
  { id: 'rice', name: 'Rice', cycleDays: 130 },
  { id: 'tomato', name: 'Tomato', cycleDays: 90 },
  { id: 'maize', name: 'Maize', cycleDays: 100 },
];

export function CropCalendarClient() {
  const [sowingDate, setSowingDate] = React.useState<Date | undefined>(new Date(2026, 6, 1)); // Default July 1, 2026
  const [selectedCropId, setSelectedCropId] = React.useState<string>("wheat");

  const selectedCrop = CROPS.find(c => c.id === selectedCropId);
  const today = new Date(2026, 6, 25); // Simulated current date: July 25, 2026
  
  const daysSinceSowing = sowingDate ? differenceInDays(today, startOfDay(sowingDate)) : 0;
  
  const currentStage = CROP_STAGES.find(
    stage => daysSinceSowing >= stage.startDay && daysSinceSowing <= stage.endDay
  ) || (daysSinceSowing > (selectedCrop?.cycleDays || 120) ? CROP_STAGES[5] : CROP_STAGES[0]);

  const progress = Math.min(100, Math.max(0, (daysSinceSowing / (selectedCrop?.cycleDays || 120)) * 100));

  // Dynamic Milestones Calculation relative to Sowing Date
  const milestones = React.useMemo(() => {
    if (!sowingDate) return [];
    return [
      { id: 1, title: "Initial Fertilization", date: addDays(sowingDate, 15), icon: Bug, type: "Nutrients" },
      { id: 2, title: "First Weeding", date: addDays(sowingDate, 25), icon: Scissors, type: "Maintenance" },
      { id: 3, title: "Irrigation Cycle A", date: addDays(sowingDate, 40), icon: Droplets, type: "Water" },
      { id: 4, title: "Urea Top Dressing", date: addDays(sowingDate, 55), icon: Bug, type: "Nutrients" },
      { id: 5, title: "Pesticide Spray (Preventive)", date: addDays(sowingDate, 80), icon: Bug, type: "Protection" },
      { id: 6, title: "Second Weeding", date: addDays(sowingDate, 95), icon: Scissors, type: "Maintenance" },
      { id: 7, title: "Pre-Harvest Check", date: addDays(sowingDate, 115), icon: CheckCircle2, type: "Ready" },
    ].map(m => ({
      ...m,
      isDueSoon: Math.abs(differenceInDays(m.date, today)) <= 1 && isAfter(m.date, today),
      isCompleted: isBefore(m.date, today),
      isUpcoming: isAfter(m.date, today)
    }));
  }, [sowingDate]);

  const alerts = milestones.filter(m => m.isDueSoon);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Configuration Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-secondary/20 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Crop & Sowing Setup</CardTitle>
            <CardDescription>Enter details to generate your personalized timeline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Crop</Label>
              <Select value={selectedCropId} onValueChange={setSelectedCropId}>
                <SelectTrigger className="bg-background">
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
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-background">
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
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Smart Alerts Section */}
        <Card className={cn(
          "border-none shadow-md transition-colors",
          alerts.length > 0 ? "bg-amber-50 dark:bg-amber-950/20" : "bg-secondary/10"
        )}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className={cn("size-5", alerts.length > 0 ? "text-amber-600" : "text-muted-foreground")} />
              Smart Alerts
            </CardTitle>
            <CardDescription>24-hour lead time for upcoming tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="bg-white dark:bg-black/40 p-4 rounded-xl border border-amber-200 flex items-center justify-between shadow-sm animate-pulse">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">DUE WITHIN 24H</p>
                      <h4 className="font-bold text-sm">{alert.title}</h4>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Action Required</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Clock className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground italic">No tasks due in the next 24 hours.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2. Visual Growth Stage Tracker */}
      <Card className="border-primary/20 shadow-lg overflow-hidden bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Growth Stage Tracker</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Day {daysSinceSowing}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-10 space-y-10">
          <div className="relative px-2">
            <Progress value={progress} className="h-2" />
            <div className="absolute top-[-30px] left-0 w-full flex justify-between">
              {CROP_STAGES.map((stage) => {
                const isActive = currentStage.id === stage.id;
                const isPast = daysSinceSowing > stage.endDay;
                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div className={cn(
                      "size-10 rounded-full flex items-center justify-center transition-all duration-500",
                      isActive ? "bg-primary text-primary-foreground scale-125 ring-4 ring-primary/20 shadow-lg" : 
                      isPast ? "bg-green-100 text-green-600 scale-100" : "bg-secondary text-muted-foreground scale-90"
                    )}>
                      {isPast ? <CheckCircle2 className="size-5" /> : <stage.icon className="size-5" />}
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold uppercase mt-2 tracking-tighter transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-black/40 p-5 rounded-2xl border border-dashed border-primary/30 flex gap-4 items-center">
            <div className="bg-primary/20 p-3 rounded-xl">
              <Info className="size-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Expert Tip: {currentStage.label} Stage</h4>
              <p className="text-sm text-muted-foreground italic">"{currentStage.tip}"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Season Milestones Timeline */}
      <div className="space-y-6">
        <h3 className="font-headline text-3xl px-2">Season Timeline Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className={cn(
              "border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden",
              milestone.isCompleted ? "bg-secondary/10 opacity-70" : "bg-white dark:bg-card"
            )}>
              <CardContent className="p-5 flex gap-4 items-center">
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                  milestone.isCompleted ? "bg-green-50 text-green-500" : "bg-primary/10 text-primary"
                )}>
                  {milestone.isCompleted ? <CheckCircle2 className="size-6" /> : <milestone.icon className="size-6" />}
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    {milestone.title}
                    {milestone.isDueSoon && <span className="size-2 rounded-full bg-amber-500 animate-ping" />}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {format(milestone.date, "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[9px] font-bold uppercase">
                  {milestone.type}
                </Badge>
              </CardContent>
              {milestone.isCompleted && (
                <div className="absolute top-0 right-0 p-2">
                  <CheckCircle2 className="size-4 text-green-500/30" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
