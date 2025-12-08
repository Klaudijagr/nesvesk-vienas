"use client";

import {
  Autocomplete,
  Circle,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Loader2, Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types for coordinates
type LatLng = {
  lat: number;
  lng: number;
};

// Lithuania cities with coordinates
const CITIES: Record<string, LatLng> = {
  Vilnius: { lat: 54.6872, lng: 25.2797 },
  Kaunas: { lat: 54.8985, lng: 23.9036 },
  Klaipėda: { lat: 55.7033, lng: 21.1443 },
  Šiauliai: { lat: 55.9349, lng: 23.3137 },
  Panevėžys: { lat: 55.7348, lng: 24.3575 },
};

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

const libraries: "places"[] = ["places"];

export default function LocationPickerPage() {
  const [selectedCity, setSelectedCity] = useState("Vilnius");
  const [center, setCenter] = useState<LatLng>(CITIES.Vilnius);
  const [radius, setRadius] = useState(500); // meters
  const [circleCenter, setCircleCenter] = useState<LatLng>(CITIES.Vilnius);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const searchResultRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onLoad = useCallback((loadedMap: google.maps.Map) => {
    setMap(loadedMap);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle city change
  const handleCityChange = (city: keyof typeof CITIES) => {
    setSelectedCity(city);
    setCenter(CITIES[city]);
    setCircleCenter(CITIES[city]);
    map?.panTo(CITIES[city]);
    map?.setZoom(14);
  };

  // Handle address search
  const onPlaceLoad = (autocomplete: google.maps.places.Autocomplete) => {
    searchResultRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (searchResultRef.current) {
      const place = searchResultRef.current.getPlace();
      if (place.geometry?.location) {
        const newLoc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(newLoc);
        setCircleCenter(newLoc);
        map?.panTo(newLoc);
        map?.setZoom(15);
        setSelectedCity("Custom");
      }
    }
  };

  // Handle circle drag
  const handleCircleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setCircleCenter({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  // Handle circle center change (when editing)
  const handleCircleCenterChanged = (circle: google.maps.Circle | null) => {
    if (circle) {
      const newCenter = circle.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        // Check if value actually changed significantly to avoid infinite loop
        if (
          Math.abs(lat - circleCenter.lat) > 0.000_001 ||
          Math.abs(lng - circleCenter.lng) > 0.000_001
        ) {
          setCircleCenter({ lat, lng });
        }
      }
    }
  };

  // Handle radius change via API (dragging edge)
  const handleCircleRadiusChanged = (circle: google.maps.Circle | null) => {
    if (circle) {
      const newRadius = circle.getRadius();
      if (Math.abs(newRadius - radius) > 1) {
        setRadius(Math.round(newRadius));
      }
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p className="font-medium">Failed to load Google Maps</p>
              <p className="mt-2 text-muted-foreground text-sm">
                Check your API key and network connection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      <div className="text-center">
        <h1 className="font-bold text-2xl">Location Privacy Picker</h1>
        <p className="mt-2 text-muted-foreground">
          Set your approximate location area. Your exact address remains
          private.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          {/* Address Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-medium text-sm">
                Find Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
                <Autocomplete
                  onLoad={onPlaceLoad}
                  onPlaceChanged={onPlaceChanged}
                >
                  <Input className="pl-9" placeholder="Enter address..." />
                </Autocomplete>
              </div>
              <p className="mt-2 rounded border border-blue-100 bg-blue-50 p-2 text-[10px] text-muted-foreground dark:border-blue-800 dark:bg-blue-900/20">
                <span className="font-semibold">Privacy Note:</span> No one will
                see your exact address. They only see the random area you
                define.
              </p>
            </CardContent>
          </Card>

          {/* Radius Slider */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-medium text-sm">
                Privacy Area Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label className="text-muted-foreground text-xs">
                  Radius: {radius} meters
                </Label>
                <input
                  className="mt-2 w-full cursor-pointer accent-black dark:accent-white"
                  max="2000"
                  min="100"
                  onChange={(e) => setRadius(Number(e.target.value))}
                  step="50"
                  type="range"
                  value={radius}
                />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>100m</span>
                  <span>2km</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-medium text-sm">Quick Jump</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CITIES) as Array<keyof typeof CITIES>).map(
                  (city) => (
                    <Button
                      className="h-7 text-xs"
                      key={city}
                      onClick={() => handleCityChange(city)}
                      size="sm"
                      variant={selectedCity === city ? "default" : "outline"}
                    >
                      {city}
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="relative h-[500px] overflow-hidden rounded-xl border shadow-sm">
          <GoogleMap
            center={center}
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              zoomControl: true,
            }}
            zoom={14}
          >
            {/* 
                  Using a key ensures React recreates the circle if needed, 
                  but actually stable reference is better. 
                  We use the coordinates as key parts to force updates if needed 
                  or keep it stable.
                */}
            <Circle
              center={circleCenter}
              draggable={true}
              editable={true} // Allows resizing by dragging edge handles
              onCenterChanged={function (this: google.maps.Circle) {
                handleCircleCenterChanged(this);
              }}
              onDragEnd={handleCircleDragEnd}
              onRadiusChanged={function (this: google.maps.Circle) {
                // Dragging handles updates radius
                handleCircleRadiusChanged(this);
              }}
              options={{
                fillColor: "#ef4444",
                fillOpacity: 0.15,
                strokeColor: "#ef4444",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                clickable: true,
                zIndex: 1,
              }}
              radius={radius}
            />
          </GoogleMap>

          <div className="pointer-events-none absolute bottom-4 left-4 max-w-xs rounded-lg border bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
            <p>
              Drag the <strong>red circle</strong> to move the privacy zone.
            </p>
            <p>
              Drag the <strong>white dots</strong> on the edge to resize.
            </p>
          </div>
        </div>
      </div>

      {/* Result Preview */}
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-green-700 text-lg dark:text-green-300">
            Ready to Save
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1 font-mono text-green-800 text-sm dark:text-green-200">
              <p>
                Center: {circleCenter.lat.toFixed(6)},{" "}
                {circleCenter.lng.toFixed(6)}
              </p>
              <p>
                Radius: {radius}m / Privacy Area:{" "}
                {Math.round(Math.PI * radius ** 2)}m²
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Save Location
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
