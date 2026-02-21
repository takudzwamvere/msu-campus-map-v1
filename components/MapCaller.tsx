"use client";

import dynamic from "next/dynamic";

interface MapProps {
  searchQuery: string;
  activeFilter: string | null;
  userLocation: [number, number] | null;
  destination: [number, number] | null;
  onGetDirections: (lat: number, lng: number) => void;
}

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#1a1a2e] relative overflow-hidden">
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Pulsing map pin */}
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping absolute inset-0" />
        <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center relative">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      
      <p className="text-sm font-semibold text-gray-400 tracking-wide">Loading Map...</p>
    </div>
  ),
});

export default function MapCaller(props: MapProps) {
  return <Map {...props} />;
}
