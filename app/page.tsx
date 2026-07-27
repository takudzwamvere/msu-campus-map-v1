"use client";

import MapCaller from "@/components/MapCaller";
import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import WelcomeModal from "@/components/WelcomeModal";
import Toast from "@/components/Toast";
import OfflineIndicator from "@/components/OfflineIndicator";
import InstallPrompt from "@/components/InstallPrompt";
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
  const [pendingDestination, setPendingDestination] = useState<[number, number] | null>(null);
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
          setToastMessage("Location access denied. Tap anywhere on the map to set your position manually.");
          setPendingDestination([lat, lng]);
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setToastMessage("Location unavailable. Tap on the map to set your position.");
          setPendingDestination([lat, lng]);
        } else {
          setToastMessage("Unable to retrieve your location. Tap the map to set it manually.");
          setPendingDestination([lat, lng]);
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

  const handlePlannedRoute = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    setUserLocation([fromLat, fromLng]);
    setDestination([toLat, toLng]);
    setRouteSummary(null);
  };

  const handleMapLocationSet = (lat: number, lng: number) => {
    if (!pendingDestination) return;
    setUserLocation([lat, lng]);
    setDestination(pendingDestination);
    setPendingDestination(null);
    setRouteSummary(null);
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
        pendingDestination={pendingDestination}
        onMapLocationSet={handleMapLocationSet}
      />

      {/* Floating Search / Sidebar */}
      <Sidebar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onGetDirections={handleGetDirections}
        onFlyTo={handleFlyTo}
        onPlanRoute={handlePlannedRoute}
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

      {/* Pending location hint banner */}
      {pendingDestination && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[6000] pointer-events-none">
          <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-xl border border-amber-500/40 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl text-sm font-semibold">
            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Tap the map to set your starting location
            <button
              onClick={() => setPendingDestination(null)}
              className="pointer-events-auto ml-1 text-amber-400/60 hover:text-amber-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
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
      <OfflineIndicator />
      <InstallPrompt />
    </main>
  );
}
