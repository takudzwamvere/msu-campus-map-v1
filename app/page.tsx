"use client";

import MapCaller from "@/components/MapCaller";
import MapOverlay from "@/components/MapOverlay";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState("satellite");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  const handleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleGetDirections = (lat: number, lng: number) => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setDestination([lat, lng]);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please check your permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <MapOverlay 
        onSearch={setSearchQuery} 
        activeFilter={activeFilter} 
        onFilter={handleFilter}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
        searchQuery={searchQuery}
        onGetDirections={handleGetDirections}
      />
      <MapCaller 
        searchQuery={searchQuery} 
        activeFilter={activeFilter}
        mapStyle={mapStyle}
        userLocation={userLocation}
        destination={destination}
        onGetDirections={handleGetDirections}
      />
    </main>
  );
}
