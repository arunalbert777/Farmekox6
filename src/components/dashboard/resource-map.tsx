"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type PlaceResult = google.maps.places.PlaceResult;

function ResourceMapContent() {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [searchQuery, setSearchQuery] = useState("agro stores");
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [geolocating, setGeolocating] = useState(true);
  const fallbackPosition = { lat: 12.9716, lng: 77.5946 }; // Bengaluru

  useEffect(() => {
    setGeolocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setGeolocating(false);
        },
        () => {
          console.warn("Geolocation failed or was denied. Falling back to default location.");
          setCurrentPosition(fallbackPosition); 
          setGeolocating(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser. Falling back to default location.");
      setCurrentPosition(fallbackPosition);
      setGeolocating(false);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    if (!placesLibrary || !map) return;
    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  useEffect(() => {
    if (currentPosition && map) {
      map.setCenter(currentPosition);
    }
  }, [currentPosition, map]);

  const handleSearch = () => {
    if (!placesService || !map || !map.getCenter() || !searchQuery) return;

    setLoading(true);
    setPlaces([]);

    const request: google.maps.places.TextSearchRequest = {
      query: searchQuery,
      location: map.getCenter()!,
      radius: 5000,
    };

    placesService.textSearch(request, (results, status) => {
      setLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results);
      }
    });
  };

  // Perform an initial search when the service is ready and location is found.
  useEffect(() => {
    if (placesService && currentPosition) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesService, currentPosition]);

  return (
    <div className="w-full h-full relative">
      {geolocating && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Detecting your location...</p>
        </div>
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm flex gap-2 px-4">
        <Input
          type="text"
          placeholder="e.g., 'agro stores', 'fertilizer shops'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="bg-background/90 backdrop-blur-sm shadow-md"
        />
        <Button onClick={handleSearch} disabled={loading || geolocating} size="icon" className="shadow-md">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          <span className="sr-only">Search</span>
        </Button>
      </div>

      <Map
        defaultCenter={fallbackPosition}
        defaultZoom={13}
        mapId="farmekox_map"
        className="w-full h-full"
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {places.map((place) =>
          place.geometry?.location ? (
            <AdvancedMarker
              key={place.place_id}
              position={place.geometry.location}
              onClick={() => setSelectedPlace(place)}
            >
                <div
                    className="w-5 h-5 rounded-full border-2 border-white bg-primary"
                    title={place.name || ''}
                />
            </AdvancedMarker>
          ) : null
        )}
        {currentPosition && (
          <AdvancedMarker position={currentPosition} title="Your Location">
             <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
          </AdvancedMarker>
        )}
      </Map>

      <Sheet
        open={!!selectedPlace}
        onOpenChange={(open) => !open && setSelectedPlace(null)}
      >
        <SheetContent>
          {selectedPlace && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedPlace.name}</SheetTitle>
                <SheetDescription>
                  <p>{selectedPlace.formatted_address}</p>
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                {selectedPlace.rating && (
                    <div className="flex items-center gap-2 text-sm">
                        <Star className="size-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold">{selectedPlace.rating}</span>
                        <span className="text-muted-foreground">({selectedPlace.user_ratings_total} reviews)</span>
                    </div>
                )}
                {selectedPlace.opening_hours && (
                  <p className={`text-sm font-semibold ${selectedPlace.opening_hours.isOpen() ? 'text-green-600' : 'text-destructive'}`}>
                    {selectedPlace.opening_hours.isOpen() ? 'Open now' : 'Closed'}
                  </p>
                )}
                {selectedPlace.types && (
                    <div className="flex flex-wrap gap-2">
                    {selectedPlace.types.map((type) => (
                      <Badge key={type} variant="secondary">{type.replace(/_/g, ' ')}</Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground pt-4">
                  Further details like contact information and opening hours can be loaded from the Google Places API.
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function ResourceMap({ apiKey }: { apiKey: string }) {
  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <ResourceMapContent />
    </APIProvider>
  );
}
