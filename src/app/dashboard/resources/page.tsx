import { Map, Terminal } from "lucide-react";
import { ResourceMap } from "@/components/dashboard/resource-map";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ResourcesPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="text-center mb-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Map className="size-8 text-primary" />
          </div>
          <h1 className="font-headline text-3xl mt-4">Nearby Resources</h1>
          <p className="text-muted-foreground">Find seed stores, fertilizer shops, and mandis near you.</p>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border flex items-center justify-center p-4 bg-secondary/20">
          <Alert variant="destructive" className="max-w-md text-left">
            <Terminal className="h-4 w-4" />
            <AlertTitle>API Key Not Configured</AlertTitle>
            <AlertDescription>
              <p>
                Your Google Maps API key is not set up correctly. Please add it to your <code>.env</code> file.
              </p>
              <pre className="mt-2 rounded-md bg-muted p-2 text-sm overflow-x-auto">
                <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"</code>
              </pre>
              <p className="mt-2">
                After adding the key, you must restart your development server for the changes to apply.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="text-center mb-4">
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
