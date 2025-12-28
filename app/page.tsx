"use client";

import MapCaller from "@/components/MapCaller";
import MapOverlay from "@/components/MapOverlay";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState("satellite");

  const handleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <MapOverlay 
        onSearch={setSearchQuery} 
        activeFilter={activeFilter} 
        onFilter={handleFilter}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
      />
      <MapCaller 
        searchQuery={searchQuery} 
        activeFilter={activeFilter}
        mapStyle={mapStyle}
      />
    </main>
  );
}
