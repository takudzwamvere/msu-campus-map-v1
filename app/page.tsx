"use client";

import MapCaller from "@/components/MapCaller";
import MapOverlay from "@/components/MapOverlay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapStyle, setMapStyle] = useState("satellite");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  const handleGetDirections = (lat: number, lng: number) => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Campus Bounds
          const minLat = -19.52537558894653;
          const maxLat = -19.510376639335032;
          const minLng = 29.822780000537907;
          const maxLng = 29.841267598229543;

          const isWithinBounds = 
            userLat >= minLat && userLat <= maxLat && 
            userLng >= minLng && userLng <= maxLng;

          if (isWithinBounds) {
            setUserLocation([userLat, userLng]);
          } else {
             // Fallback if user is outside campus boundaries
            setUserLocation([-19.510271810936406, 29.841081806506132]);
          }
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

  const handleClearRoute = () => {
    setDestination(null);
    setUserLocation(null); 
  };

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onGetDirections={handleGetDirections}
        isRouting={!!destination}
        onClearRoute={handleClearRoute}
      />
      
      <div className="relative flex-1 w-full overflow-hidden">
        <MapOverlay 
          mapStyle={mapStyle}
          onMapStyleChange={setMapStyle}
        />
        <MapCaller 
          searchQuery={searchQuery} 
          activeFilter={null}
          mapStyle={mapStyle}
          userLocation={userLocation}
          destination={destination}
          onGetDirections={handleGetDirections}
        />
      </div>

      <Footer />
    </main>
  );
}
