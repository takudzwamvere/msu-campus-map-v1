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
             // Fallback if user is outside campus boundaries (Front Gate)
            setUserLocation([-19.510271810936406, 29.841081806506132]);
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
        <div className="space-y-3">
          <p>It seems as if you are currently outside the campus boundaries.
          </p>
          <p className="text-gray-600">
            In order to avoid generating directions from outside the campus, directions have been generated starting from the <span className="font-semibold text-indigo-600">Main Front Gate</span> to your selected destination.
          </p>
          <div className="p-3 bg-blue-50 text-blue-800 text-sm border border-blue-100">
            <p>
              <strong>Note:</strong> Turn-by-turn navigation works best when you are on campus grounds.
            </p>
          </div>
        </div>
      </Modal>
    </main>
  );
}
