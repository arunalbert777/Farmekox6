import { CropCalendarClient } from "@/components/dashboard/crop-calendar-client";

export default function CropCalendarPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl">Crop Management</h1>
        <p className="text-muted-foreground italic">Your farming journey starts here.</p>
      </div>
      <CropCalendarClient />
    </div>
  );
}
