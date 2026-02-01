"use client";

import { useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CalendarEvent = {
  date: Date;
  title: string;
  type: "sowing" | "irrigation" | "fertilization" | "harvesting" | "scouting";
};

const today = new Date();
const events: CalendarEvent[] = [
  { date: today, title: "Scout for pests in maize field", type: "scouting" },
  { date: addDays(today, 2), title: "Irrigate wheat fields", type: "irrigation" },
  { date: addDays(today, 5), title: "Apply nitrogen fertilizer", type: "fertilization" },
  { date: addDays(today, 15), title: "Harvest tomatoes", type: "harvesting" },
  { date: addDays(today, 30), title: "Sow new batch of spinach", type: "sowing" },
];

const eventTypeColors = {
  sowing: "bg-green-500",
  irrigation: "bg-blue-500",
  fertilization: "bg-yellow-500",
  harvesting: "bg-orange-500",
  scouting: "bg-purple-500",
};

export function CropCalendarClient() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDayEvents = events.filter((event) =>
    date ? isSameDay(event.date, date) : false
  );

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => {
              const dayEvents = events.filter((event) => isSameDay(event.date, date));
              return (
                <div className="relative h-full w-full">
                  <span className="relative z-10">{format(date, "d")}</span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <div key={index} className={`h-1.5 w-1.5 rounded-full ${eventTypeColors[event.type]}`}></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>
              Events for {date ? format(date, "MMMM d, yyyy") : "..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${eventTypeColors[event.type]}`} />
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <Badge variant="secondary" className="capitalize mt-1">{event.type}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No events scheduled for this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
