"use client";

import MapCaller from "@/components/MapCaller";
import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import WelcomeModal from "@/components/WelcomeModal";
import Toast from "@/components/Toast";
import { useState, useEffect, useCallback } from "react";
import { isWithinCampus } from "@/constants/campus-bounds";
import type { RouteSummary } from "@/components/MapRouting";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [focusedLocation, setFocusedLocation] = useState<[number, number] | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
      setToastMessage("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setUserLocation([userLat, userLng]);
        if (!isWithinCampus(userLat, userLng)) setIsModalOpen(true);
        setDestination([lat, lng]);
      },
      (error) => {
        console.error("Error getting location:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setToastMessage("Location access denied. Please enable it in your browser settings, or tap on the map to set your location manually.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setToastMessage("Your location could not be determined. Try again or set your location manually.");
        } else {
          setToastMessage("Unable to retrieve your location. Please check your permissions.");
        }
      }
    );
  };

  const handleClearRoute = () => {
    setDestination(null);
    setUserLocation(null);
    setRouteSummary(null);
  };

  const handleFlyTo = (lat: number, lng: number, buildingName?: string) => {
    setFocusedLocation([lat, lng]);
    if (buildingName) setSelectedBuilding(buildingName);
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
        focusedLocation={focusedLocation}
        selectedBuilding={selectedBuilding}
        onRouteSummary={setRouteSummary}
      />

      {/* Floating Search / Sidebar */}
      <Sidebar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onGetDirections={handleGetDirections}
        onFlyTo={handleFlyTo}
        isRouting={!!destination}
        onClearRoute={handleClearRoute}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        routeSummary={routeSummary}
      />

      {/* Modals */}
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* About / re-open welcome button — bottom-left, above mobile sidebar */}
      {!showWelcome && (
        <button
          onClick={() => setShowWelcome(true)}
          title="About this map"
          className="fixed bottom-24 md:bottom-4 left-4 z-[2500] w-9 h-9 rounded-xl bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.08] shadow-lg text-gray-400 hover:text-white hover:bg-[#1a1a2e] transition-all flex items-center justify-center"
        >
          <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}

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
