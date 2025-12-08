"use client";

import { Circle, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  height: "400px",
  borderRadius: "12px",
};

// Privacy radius options (in meters)
const RADIUS_OPTIONS = [
  { label: "High Privacy (1km)", value: 1000 },
  { label: "Medium Privacy (500m)", value: 500 },
  { label: "Low Privacy (200m)", value: 200 },
];

export default function LocationPickerPage() {
  const [selectedCity, setSelectedCity] = useState("Vilnius");
  const [center, setCenter] = useState<LatLng>(CITIES.Vilnius);
  const [radius, setRadius] = useState(500); // meters
  const [circleCenter, setCircleCenter] = useState<LatLng>(CITIES.Vilnius);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
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

  // Handle radius change
  const handleRadiusChanged = (circle: google.maps.Circle | null) => {
    if (circle) {
      const newRadius = circle.getRadius();
      setRadius(Math.round(newRadius));
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
                Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in your
                .env.local
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
          Drag the circle to set your approximate location. People will only see
          this area, not your exact address.
        </p>
      </div>

      {/* City Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Your City
          </CardTitle>
          <CardDescription>
            Choose your city, then drag the circle to your approximate
            neighborhood
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CITIES) as Array<keyof typeof CITIES>).map((city) => (
              <Button
                key={city}
                onClick={() => handleCityChange(city)}
                variant={selectedCity === city ? "default" : "outline"}
              >
                {city}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Drag the Circle</CardTitle>
          <CardDescription>
            The circle shows the area people will see. Drag it to adjust, or
            drag the edges to change size.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleMap
            center={center}
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            zoom={14}
          >
            <Circle
              center={circleCenter}
              draggable={true}
              editable={true}
              onCenterChanged={function (this: google.maps.Circle) {
                handleCircleCenterChanged(this);
              }}
              onDragEnd={handleCircleDragEnd}
              onRadiusChanged={function (this: google.maps.Circle) {
                handleRadiusChanged(this);
              }}
              options={{
                fillColor: "#ef4444",
                fillOpacity: 0.2,
                strokeColor: "#ef4444",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
              radius={radius}
            />
          </GoogleMap>
        </CardContent>
      </Card>

      {/* Privacy Level Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Level</CardTitle>
          <CardDescription>
            Adjust how much area is shown to others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                onClick={() => setRadius(option.value)}
                variant={radius === option.value ? "default" : "outline"}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="mt-4 text-muted-foreground text-sm">
            Current radius: <span className="font-medium">{radius}m</span>
          </p>
        </CardContent>
      </Card>

      {/* Result Preview */}
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">
            Location Data Preview
          </CardTitle>
          <CardDescription>
            This is what would be saved to your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <Label className="text-muted-foreground">City:</Label>
              <span className="ml-2">{selectedCity}</span>
            </div>
            <div>
              <Label className="text-muted-foreground">Center (hidden):</Label>
              <span className="ml-2">
                {circleCenter.lat.toFixed(6)}, {circleCenter.lng.toFixed(6)}
              </span>
            </div>
            <div>
              <Label className="text-muted-foreground">Radius:</Label>
              <span className="ml-2">{radius}m</span>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full">Save Location</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
