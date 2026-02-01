"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

type Resource = {
  id: number;
  name: string;
  type: "seed" | "fertilizer" | "mandi";
  position: { lat: number; lng: number };
};

const resources: Resource[] = [
  { id: 1, name: "Kisan Seed Store", type: "seed", position: { lat: 12.9716, lng: 77.5946 } },
  { id: 2, name: "Annapurna Fertilizers", type: "fertilizer", position: { lat: 12.9750, lng: 77.6000 } },
  { id: 3, name: "Bengaluru APMC Yard", type: "mandi", position: { lat: 12.9800, lng: 77.5850 } },
  { id: 4, name: "Green Valley Seeds", type: "seed", position: { lat: 12.9650, lng: 77.5890 } },
];

const markerColors = {
  seed: "#2ecc71",
  fertilizer: "#f1c40f",
  mandi: "#e67e22",
};

export function ResourceMap({ apiKey }: { apiKey: string }) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const position = { lat: 12.9716, lng: 77.5946 }; // Bengaluru

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={position}
        defaultZoom={13}
        mapId="farmekox_map"
        className="w-full h-full"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {resources.map((resource) => (
          <AdvancedMarker
            key={resource.id}
            position={resource.position}
            onClick={() => setSelectedResource(resource)}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: markerColors[resource.type] }}
            />
          </AdvancedMarker>
        ))}
      </Map>
      <Sheet open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <SheetContent>
            {selectedResource && (
                <>
                <SheetHeader>
                    <SheetTitle>{selectedResource.name}</SheetTitle>
                    <SheetDescription>
                        <span className="capitalize font-semibold" style={{color: markerColors[selectedResource.type]}}>
                            {selectedResource.type} Store
                        </span>
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <p>Details about the resource would appear here, like contact information, opening hours, and available products.</p>
                </div>
                </>
            )}
        </SheetContent>
      </Sheet>
    </APIProvider>
  );
}
