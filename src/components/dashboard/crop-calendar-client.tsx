"use client";

import * as React from "react";
import { format, parseISO, startOfDay, isSameDay } from "date-fns";
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
  FlaskConical
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

  // Dates with events for the calendar modifiers
  const eventDates = React.useMemo(() => {
    return schedule.map(event => parseISO(event.date));
  }, [schedule]);

  const selectedDayEvents = React.useMemo(() => {
    if (!selectedDay) return [];
    return schedule.filter(event => isSameDay(parseISO(event.date), selectedDay));
  }, [selectedDay, schedule]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
      {/* 1. Configuration Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Setup Your Field</CardTitle>
            <CardDescription>Select crop and sowing date for AI planning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Crop</Label>
              <Select value={selectedCropId} onValueChange={setSelectedCropId}>
                <SelectTrigger>
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
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
            <Button onClick={handleGenerateSchedule} disabled={loading} className="w-full h-12">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {loading ? "Generating..." : "Generate AI Schedule"}
            </Button>
          </CardContent>
        </Card>

        {selectedDay && (
          <Card className="animate-in fade-in slide-in-from-left-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="size-4 text-primary" />
                Activities for {format(selectedDay, "MMM d")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayEvents.map((event, idx) => {
                    const Icon = ACTIVITY_ICONS[event.activityType] || Info;
                    return (
                      <div key={idx} className={cn("p-4 rounded-xl border flex gap-4 items-start shadow-sm", ACTIVITY_COLORS[event.activityType])}>
                        <div className="bg-white/80 p-2 rounded-lg shadow-sm">
                          <Icon className="size-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm">{event.activityType}</h4>
                          <p className="text-xs opacity-90 leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-6">
                  No activities scheduled for this day.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 2. Interactive Calendar View */}
      <Card className="lg:col-span-2">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Crop Activity Calendar</CardTitle>
              <CardDescription>Click on a highlighted date to see tasks.</CardDescription>
            </div>
            {schedule.length > 0 && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                AI Schedule Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex justify-center border rounded-xl p-4 bg-card">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{
                event: eventDates
              }}
              modifiersClassNames={{
                event: "bg-primary/20 text-primary font-bold border-2 border-primary/40 rounded-full"
              }}
              className="rounded-md border-none scale-110 md:scale-125 origin-center"
            />
          </div>

          <div className="w-full md:w-72 space-y-4">
            <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-widest px-2">Upcoming Events</h3>
            <ScrollArea className="h-[400px] px-2">
              <div className="space-y-3">
                {schedule.length > 0 ? schedule.map((event, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(parseISO(event.date))}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all hover:shadow-md group flex items-center justify-between",
                      isSameDay(parseISO(event.date), selectedDay || new Date(0)) ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"
                    )}
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{format(parseISO(event.date), "MMM d, yyyy")}</p>
                      <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{event.activityType}</h4>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                )) : (
                  <div className="text-center py-12 space-y-2 opacity-50">
                    <CalendarIcon className="size-8 mx-auto text-muted-foreground" />
                    <p className="text-xs font-medium">Generate a schedule to see events.</p>
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
