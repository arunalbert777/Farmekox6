import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CropCalendarClient } from "@/components/dashboard/crop-calendar-client";

export default function CropCalendarPage() {
  return (
    <div className="container mx-auto">
        <Card>
            <CardHeader className="items-center">
                 <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <CalendarDays className="size-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl mt-4">Crop Calendar</CardTitle>
                <CardDescription>Your personalized guide for all farming activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <CropCalendarClient />
            </CardContent>
        </Card>
    </div>
  );
}
