import { Map } from "lucide-react";
import { ResourceMap } from "@/components/dashboard/resource-map";

export default function ResourcesPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="container mx-auto max-w-2xl text-center p-8">
        <Map className="mx-auto size-12 text-muted-foreground" />
        <h1 className="font-headline text-3xl mt-4">Resource Locator</h1>
        <p className="text-destructive mt-4">
          Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
       <div className='text-center mb-4'>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Map className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">Nearby Resources</h1>
        <p className="text-muted-foreground">Find seed stores, fertilizer shops, and mandis near you.</p>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden border">
        <ResourceMap apiKey={apiKey} />
      </div>
    </div>
  );
}
