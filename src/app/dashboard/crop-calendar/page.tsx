
import { CropCalendarClient } from "@/components/dashboard/crop-calendar-client";

export default function CropCalendarPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl">Personalized Crop Scheduler</h1>
        <p className="text-muted-foreground italic">AI-driven agricultural milestones based on your sowing cycle.</p>
      </div>
      <CropCalendarClient />
    </div>
  );
}
