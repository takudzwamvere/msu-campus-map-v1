"use client";

import MapCaller from "@/components/MapCaller";
import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import WelcomeModal from "@/components/WelcomeModal";
import { useState, useEffect } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("msu-map-welcome-dismissed");
      if (!dismissed) setShowWelcome(true);
    } catch {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isModalOpen) setIsModalOpen(false);
        if (showWelcome) setShowWelcome(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isModalOpen, showWelcome]);

  const handleGetDirections = (lat: number, lng: number) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const minLat = -19.525414674850833;
        const maxLat = -19.507078465507732;
        const minLng = 29.82276282383294;
        const maxLng = 29.846761174571597;

        const isWithinBounds =
          userLat >= minLat && userLat <= maxLat &&
          userLng >= minLng && userLng <= maxLng;

        setUserLocation([userLat, userLng]);
        if (!isWithinBounds) setIsModalOpen(true);
        setDestination([lat, lng]);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please check your permissions.");
      }
    );
  };

  const handleClearRoute = () => {
    setDestination(null);
    setUserLocation(null);
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Map takes 100% — everything else floats on top */}
      <MapCaller
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        userLocation={userLocation}
        destination={destination}
        onGetDirections={handleGetDirections}
      />

      {/* Floating Search / Sidebar */}
      <Sidebar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onGetDirections={handleGetDirections}
        isRouting={!!destination}
        onClearRoute={handleClearRoute}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Modals */}
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

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
            We&apos;ll generate a route from your current location, but turn-by-turn navigation is optimized for <span className="text-cyan-400 font-semibold">campus grounds</span>.
          </p>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-xs">
            <strong>Note:</strong> Accuracy may vary outside the university area.
          </div>
        </div>
      </Modal>
    </main>
  );
}
