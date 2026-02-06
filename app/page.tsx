"use client";

import MapCaller from "@/components/MapCaller";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import WelcomeModal from "@/components/WelcomeModal";
import MapLegend from "@/components/MapLegend";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGetDirections = (lat: number, lng: number) => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Updated Campus Bounds
          const minLat = -19.525414674850833;
          const maxLat = -19.507078465507732;
          const minLng = 29.82276282383294;
          const maxLng = 29.846761174571597;

          const isWithinBounds = 
            userLat >= minLat && userLat <= maxLat && 
            userLng >= minLng && userLng <= maxLng;

          if (isWithinBounds) {
            setUserLocation([userLat, userLng]);
          } else {
             // User is outside campus boundaries - Warn them but still route
            setUserLocation([userLat, userLng]);
            setIsModalOpen(true);
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
    <main className="flex flex-col h-dvh w-full overflow-hidden bg-gray-50">
      <Sidebar 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onGetDirections={handleGetDirections}
        isRouting={!!destination}
        onClearRoute={handleClearRoute}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <MapLegend />

      <div className="relative flex-1 w-full overflow-hidden">
        <MapCaller 
          searchQuery={searchQuery} 
          activeFilter={activeFilter}
          userLocation={userLocation}
          destination={destination}
          onGetDirections={handleGetDirections}
        />
      </div>

      <Footer />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title=""
      >
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            You appear to be <span className="text-red-400 font-semibold">outside campus boundaries</span>.
          </p>
          <p className="text-gray-400 text-sm">
             We will generate a route from your current location, but please note that turn-by-turn navigation is optimized for <span className="text-cyan-400 font-semibold">campus grounds</span>.
          </p>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-xs">
            <p>
              <strong>Note:</strong> Accuracy may vary outside the university area.
            </p>
          </div>
        </div>
      </Modal>
    </main>
  );
}
