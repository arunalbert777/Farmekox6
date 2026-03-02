
"use client";

import * as React from "react";
import { format, addDays, differenceInDays, isBefore, isAfter, startOfDay } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Sprout,
  Droplets,
  Bug,
  Scissors,
  ChevronRight,
  Info,
  AlertCircle,
  TrendingUp,
  LayoutGrid,
  MapPin,
  Bell
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Crop Lifecycle Definitions (Days from Sowing)
const CROP_STAGES = [
  { id: 'germination', label: 'Germination', icon: Sprout, startDay: 0, endDay: 7, tip: "Keep soil consistently moist but not waterlogged." },
  { id: 'seedling', label: 'Seedling', icon: Sprout, startDay: 8, endDay: 21, tip: "Monitor for early-stage pests and ensure adequate sunlight." },
  { id: 'vegetative', label: 'Vegetative', icon: LeafIcon, startDay: 22, endDay: 60, tip: "Apply nitrogen-rich fertilizer to support leaf and stem growth." },
  { id: 'flowering', label: 'Flowering', icon: FlowerIcon, startDay: 61, endDay: 90, tip: "Consistent moisture is critical to prevent flower drop." },
  { id: 'fruiting', label: 'Fruit Setting', icon: AppleIcon, startDay: 91, endDay: 110, tip: "Support plants if fruit is heavy; ensure potassium-rich nutrients." },
  { id: 'harvesting', label: 'Harvesting', icon: Scissors, startDay: 111, endDay: 130, tip: "Reduce watering to improve flavor and shelf-life before picking." },
];

const CROPS = [
  { id: 'wheat', name: 'Wheat', cycleDays: 120 },
  { id: 'rice', name: 'Rice', cycleDays: 130 },
  { id: 'tomato', name: 'Tomato', cycleDays: 90 },
  { id: 'maize', name: 'Maize', cycleDays: 100 },
];

export function CropCalendarClient() {
  const { toast } = useToast();
  const [sowingDate, setSowingDate] = React.useState<Date | undefined>(new Date(2026, 6, 1)); // Default July 1st, 2026
  const [selectedCropId, setSelectedCropId] = React.useState<string>("wheat");

  const selectedCrop = CROPS.find(c => c.id === selectedCropId);
  const today = new Date(2026, 6, 25); // Simulating today is July 25th, 2026
  
  const daysSinceSowing = sowingDate ? differenceInDays(today, startOfDay(sowingDate)) : 0;
  
  const currentStage = CROP_STAGES.find(
    stage => daysSinceSowing >= stage.startDay && daysSinceSowing <= stage.endDay
  ) || (daysSinceSowing > 130 ? CROP_STAGES[5] : CROP_STAGES[0]);

  const progress = Math.min(100, Math.max(0, (daysSinceSowing / (selectedCrop?.cycleDays || 120)) * 100));

  // Dynamic Milestones Calculation
  const milestones = React.useMemo(() => {
    if (!sowingDate) return [];
    return [
      { id: 1, title: "Initial Fertilization", date: addDays(sowingDate, 15), icon: Bug, type: "Nutrients" },
      { id: 2, title: "First Weeding", date: addDays(sowingDate, 25), icon: Scissors, type: "Maintenance" },
      { id: 3, title: "Urea Application", date: addDays(sowingDate, 45), icon: Bug, type: "Nutrients" },
      { id: 4, title: "Peak Irrigation Cycle", date: addDays(sowingDate, 65), icon: Droplets, type: "Water" },
      { id: 5, title: "Pesticide Spray (Preventive)", date: addDays(sowingDate, 80), icon: Bug, type: "Protection" },
      { id: 6, title: "Pre-Harvest Check", date: addDays(sowingDate, 110), icon: CheckCircle2, type: "Ready" },
    ].map(m => ({
      ...m,
      isDue: Math.abs(differenceInDays(m.date, today)) <= 1,
      isCompleted: isBefore(m.date, today),
      isUpcoming: isAfter(m.date, today)
    }));
  }, [sowingDate]);

  const dueSoonTasks = milestones.filter(m => m.isDue && m.isUpcoming);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT: SOWING CONFIG & STAGE TRACKER */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* GROWTH TRACKER CARD */}
        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 overflow-hidden shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-headline">Growth Stage Tracker</CardTitle>
                <CardDescription>Visualizing {selectedCrop?.name} lifecycle from sowing.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1">
                Day {daysSinceSowing} of {selectedCrop?.cycleDays}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {/* Progress Bar with Icons */}
            <div className="relative pt-12">
              <Progress value={progress} className="h-3" />
              <div className="absolute top-0 w-full flex justify-between px-0">
                {CROP_STAGES.map((stage, idx) => {
                  const isActive = currentStage.id === stage.id;
                  return (
                    <div key={stage.id} className="flex flex-col items-center group">
                      <div className={cn(
                        "size-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-md",
                        isActive ? "bg-primary text-primary-foreground scale-125 ring-4 ring-primary/20" : "bg-secondary text-muted-foreground scale-90"
                      )}>
                        <stage.icon className="size-5" />
                      </div>
                      <span className={cn(
                        "text-[10px] mt-2 font-bold uppercase tracking-tighter",
                        isActive ? "text-primary" : "text-muted-foreground opacity-50"
                      )}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Tip */}
            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-dashed border-primary/30 flex gap-4 items-center animate-in fade-in slide-in-from-left-4">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Info className="size-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-primary">Stage Tip: {currentStage.label}</h4>
                <p className="text-sm text-muted-foreground italic leading-tight">"{currentStage.tip}"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CROP SELECT & SOWING DATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-none bg-secondary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Configure Schedule</CardTitle>
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

          {/* SMART ALERTS CARD */}
          <Card className="border-none bg-amber-50 dark:bg-amber-950/20 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
                <Bell className="size-24 text-amber-500" />
             </div>
             <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="size-5" />
                    Smart Alerts
                </CardTitle>
             </CardHeader>
             <CardContent>
                {dueSoonTasks.length > 0 ? (
                  <div className="space-y-3">
                    {dueSoonTasks.map(task => (
                      <div key={task.id} className="bg-white dark:bg-black/40 p-3 rounded-lg border border-amber-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">DUE TOMORROW</p>
                          <h5 className="font-bold text-sm">{task.title}</h5>
                        </div>
                        <Button size="sm" variant="secondary" className="h-8 text-xs">Acknowledge</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No critical tasks due in the next 24 hours. Enjoy your day!</p>
                )}
             </CardContent>
          </Card>
        </div>

        {/* MILESTONE LIST */}
        <div className="space-y-4">
            <h3 className="font-headline text-3xl px-2">Timeline Milestones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((milestone) => (
                    <Card key={milestone.id} className={cn(
                        "border-none shadow-sm transition-all hover:shadow-md relative overflow-hidden",
                        milestone.isCompleted ? "opacity-60 grayscale-[0.5]" : ""
                    )}>
                        <CardContent className="p-4 flex gap-4 items-center">
                            <div className={cn(
                                "size-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                                milestone.isCompleted ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                            )}>
                                {milestone.isCompleted ? <CheckCircle2 className="size-6" /> : <milestone.icon className="size-6" />}
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                    {milestone.title}
                                    {milestone.isDue && <span className="size-2 rounded-full bg-amber-500 animate-ping" />}
                                </h4>
                                <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                    <CalendarIcon className="size-3" />
                                    {format(milestone.date, "MMMM d, yyyy")}
                                </p>
                            </div>
                            <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter">
                                {milestone.type}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: FIELD STATS & QUICK ACTIONS */}
      <div className="space-y-8">
        <Card className="shadow-lg border-none overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground pb-6">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <MapPin className="size-4" />
                Active Fields
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 -mt-4">
            <div className="bg-background rounded-t-3xl p-6 space-y-6 shadow-2xl relative z-10">
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-bold text-muted-foreground">Main Field (Wheat)</span>
                        <span className="text-xs font-bold text-primary">20 Acres</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/30 p-4 rounded-2xl text-center space-y-1">
                            <Droplets className="size-5 text-blue-500 mx-auto" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Moisture</p>
                            <p className="text-lg font-bold">42%</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-2xl text-center space-y-1">
                            <TrendingUp className="size-5 text-green-500 mx-auto" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Expected Yield</p>
                            <p className="text-lg font-bold">6.2t</p>
                        </div>
                    </div>
                </div>
                
                <Separator />

                <div className="space-y-3">
                    <h5 className="text-xs font-bold text-muted-foreground uppercase px-1">Quick Actions</h5>
                    <Button className="w-full justify-between h-12 rounded-xl" variant="outline">
                        Log Irrigation <ChevronRight className="size-4" />
                    </Button>
                    <Button className="w-full justify-between h-12 rounded-xl" variant="outline">
                        Record Harvest <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-600 text-white p-6 border-none shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
                <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Sprout className="size-7 text-white" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-headline text-3xl">Ready for Sowing?</h3>
                    <p className="text-sm text-green-100 leading-snug">Let AI analyze your soil conditions before you start your next cycle.</p>
                </div>
                <Button className="bg-white text-green-700 hover:bg-green-50 w-full font-bold h-11">
                    Soil Analysis Hub
                </Button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-110" />
        </Card>
      </div>

    </div>
  );
}

// Hallucinated icons support
function LeafIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
}

function FlowerIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flower"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m4.5 0A4.5 4.5 0 1 1 12 16.5M16.5 12H12m0 4.5A4.5 4.5 0 1 1 7.5 12M12 16.5V12m-4.5 0H12"/></svg>
}

function AppleIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.88.13 4.42-.49 5.74-1.05.67-.29.45-1.09-.21-1.25-3.5-.87-6.88-.87-11.12 0-.67.16-.88.96-.21 1.25 1.32.56 3.86 1.18 5.8 1.05z"/><path d="M12 19c-3.13 0-5.83-1.63-7.5-4.13a9.982 9.982 0 0 1-1.44-4.8c0-3.3 2.65-6.07 6-6.07.75 0 1.46.14 2.12.38.38.14.82.14 1.2 0 .66-.24 1.37-.38 2.12-.38 3.35 0 6 2.77 6 6.07a9.982 9.982 0 0 1-1.44 4.8C17.83 17.37 15.13 19 12 19z"/><path d="M12 4V2"/></svg>
}

function Separator() {
    return <div className="h-px bg-border w-full" />
}
