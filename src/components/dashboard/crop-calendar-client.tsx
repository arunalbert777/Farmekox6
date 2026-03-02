"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  LayoutGrid,
  MapPin,
  TrendingUp,
  PieChart as PieChartIcon,
  Sprout,
  Droplets,
  Bug,
  Scissors
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

// Mock Data
const yieldData = [
  { name: 'Wheat', value: 6.4 },
  { name: 'Corn', value: 3.2 },
  { name: 'Tomato', value: 4.7 },
  { name: 'Maize', value: 1.1 },
];

const sownAreaData = [
  { name: 'Wheat', value: 43, color: 'hsl(var(--primary))' },
  { name: 'Corn', value: 25, color: '#22c55e' },
  { name: 'Tomato', value: 15, color: '#f59e0b' },
  { name: 'Maize', value: 17, color: '#94a3b8' },
];

const yieldChartConfig = {
  value: {
    label: "Yield",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const sownChartConfig = {
  value: {
    label: "Area",
  },
} satisfies ChartConfig;

const tasks = [
  { 
    id: 1, 
    title: "Harvesting", 
    field: "Wheat field", 
    date: new Date(), 
    status: "delayed", 
    delay: "2d delay",
    icon: Scissors,
    color: "bg-amber-100 text-amber-700"
  },
  { 
    id: 2, 
    title: "Treatment", 
    field: "Corn field", 
    date: addDays(new Date(), 1), 
    status: "on-track", 
    delay: "1d away",
    icon: Bug,
    color: "bg-green-100 text-green-700"
  },
  { 
    id: 3, 
    title: "Irrigation", 
    field: "Tomato field", 
    date: addDays(new Date(), 3), 
    status: "scheduled", 
    icon: Droplets,
    color: "bg-blue-100 text-blue-700"
  },
];

const fields = [
  { id: 'f1', name: "Wheat field", type: "Wheat", area: "20 ha", yield: "0.15", harvest: "May 23, 2026", color: "bg-primary/20" },
  { id: 'f2', name: "Tomato field", type: "Tomato", area: "22 ha", yield: "0.17", harvest: "Jun 10, 2026", color: "bg-amber-100" },
];

export function CropCalendarClient() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* SECTION: YIELD & SOWN AREA (Stats) */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-sm border-none bg-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              Yield Analysis (tons)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ChartContainer config={yieldChartConfig}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis hide />
                <ChartTooltip cursor={{fill: 'transparent'}} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PieChartIcon className="size-4 text-primary" />
                Sown Area
              </CardTitle>
              <LayoutGrid className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative size-48">
              <ChartContainer config={sownChartConfig}>
                <PieChart>
                  <Pie
                    data={sownAreaData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sownAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">43</span>
                <span className="text-[10px] text-muted-foreground uppercase">ha</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-4">
              {sownAreaData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION: CALENDAR (Date Selection) */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-sm border-none overflow-hidden">
          <CardHeader className="bg-secondary/10 pb-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold">
                    <CalendarIcon className="size-4 text-primary" />
                    {date ? format(date, "dd-MM-yyyy") : "Select date"}
                </div>
                <Button variant="ghost" size="icon" className="size-8">
                    <Clock className="size-4" />
                </Button>
             </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none p-0"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary rounded-full",
                day_today: "text-primary font-bold bg-primary/10 rounded-full",
              }}
            />
            <Button className="w-full mt-6 rounded-xl h-12 text-lg font-bold shadow-lg">
              Save
            </Button>
          </CardContent>
        </Card>

        {/* SECTION: FIELDS (Mini List) */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-headline text-2xl">Fields</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="size-8 rounded-full bg-secondary/50">
                        <Search className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8 rounded-full bg-secondary/50">
                        <Filter className="size-4" />
                    </Button>
                </div>
            </div>
            {fields.map((field) => (
                <Card key={field.id} className="border-none shadow-sm group hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex gap-4">
                        <div className={`size-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${field.color}`}>
                            <Sprout className="size-8 text-primary/60" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-sm">{field.name}</h4>
                                <span className="text-[10px] text-muted-foreground">{field.type}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Harvest on {field.harvest}</p>
                            <div className="flex items-center gap-4 pt-1">
                                <div className="flex items-center gap-1">
                                    <MapPin className="size-3 text-muted-foreground" />
                                    <span className="text-[10px] font-bold">{field.area}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="size-3 text-muted-foreground" />
                                    <span className="text-[10px] font-bold">{field.yield}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      {/* SECTION: TASKS */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between px-2">
            <h3 className="font-headline text-2xl">Tasks</h3>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="size-8 rounded-full bg-secondary/50">
                    <Search className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 rounded-full bg-secondary/50">
                    <Filter className="size-4" />
                </Button>
            </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="border-none shadow-sm overflow-hidden relative group">
              {task.status === 'delayed' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              )}
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("size-12 rounded-xl flex items-center justify-center flex-shrink-0", task.color)}>
                  <task.icon className="size-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{task.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{task.field}</p>
                  <p className="text-[10px] font-medium mt-1">{format(task.date, "MMMM d")}</p>
                </div>
                {task.delay && (
                  <Badge variant="outline" className="text-[8px] uppercase tracking-tighter bg-amber-50 border-amber-200 text-amber-700">
                    {task.delay}
                  </Badge>
                )}
                {task.status === 'on-track' && (
                  <CheckCircle2 className="size-4 text-green-500" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simulated Map / Field Layout Card */}
        <Card className="mt-8 border-none bg-green-50/50 p-6 overflow-hidden relative">
            <div className="relative z-10 space-y-4">
                <div className="size-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Sprout className="size-6 text-green-600" />
                </div>
                <div>
                    <h3 className="font-headline text-3xl text-green-900">Farmekox</h3>
                    <p className="text-sm text-green-700 font-medium">Your Farming Journey Starts Here.</p>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                 <svg viewBox="0 0 100 100" className="w-full h-full fill-green-800">
                    <path d="M10,10 Q50,0 90,10 L90,90 Q50,100 10,90 Z" />
                 </svg>
            </div>
        </Card>
      </div>

    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}