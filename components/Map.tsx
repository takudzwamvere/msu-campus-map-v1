"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { CAMPUS_BUILDINGS } from "../constants/campus-data";
import { divIcon } from "leaflet";


import { useState } from "react";
import MapRouting from "./MapRouting";

const getTypeStyles = (type: string) => {
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes("dormitory") || lowerType.includes("hostel")) {
    return { color: "text-indigo-600", bg: "bg-indigo-100", border: "border-indigo-200", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" };
  }
  if (lowerType.includes("class") || lowerType.includes("lab") || lowerType.includes("theatre") || lowerType.includes("library") || lowerType.includes("workshop")) {
    return { color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200", icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" };
  }
  if (
    lowerType.includes("gym") || 
    lowerType.includes("pool") || 
    lowerType.includes("sports") ||
    lowerType.includes("basketball") ||
    lowerType.includes("volleyball") ||
    lowerType.includes("tennis") ||
    lowerType.includes("football") ||
    lowerType.includes("leisure") ||
    lowerType.includes("garden") ||
    lowerType.includes("cattle")
  ) {
    return { color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
  }
  if (lowerType.includes("dining") || lowerType.includes("cafeteria")) {
    return { color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" };
  }
  if (lowerType.includes("music") || lowerType.includes("disability") || lowerType.includes("residency") || lowerType.includes("clinic") || lowerType.includes("health")) {
    return { color: "text-violet-600", bg: "bg-violet-100", border: "border-violet-200", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" };
  }
  
  return { color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200", icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" };
};

const getMarkerIcon = (type: string) => {
  const style = getTypeStyles(type);

  // Refined Pin SVG with inner content
  const html = `
    <div class="relative flex items-center justify-center hover:scale-110 transition-transform duration-200">
      <div class="w-8 h-8 rounded-full ${style.bg} border-2 border-white shadow-lg flex items-center justify-center z-10">
         <svg class="w-5 h-5 ${style.color}" fill="currentColor" viewBox="0 0 24 24">
           <path d="${style.icon}" />
         </svg>
      </div>
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 ${style.bg} z-0"></div>
    </div>
  `;

  return divIcon({
    className: "bg-transparent border-none",
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 38], // Tip of the pin (32px height + ~6px tip)
    popupAnchor: [0, -38], // Above the pin
  });
};



export default function Map({ 
  searchQuery, 
  activeFilter, 
  mapStyle,
  userLocation,
  destination,
  onGetDirections
}: { 
  searchQuery: string; 
  activeFilter: string | null; 
  mapStyle: string;
  userLocation: [number, number] | null;
  destination: [number, number] | null;
  onGetDirections: (lat: number, lng: number) => void;
}) {

  // Filter buildings
  const filteredBuildings = CAMPUS_BUILDINGS.filter((building) => {
    // 1. Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = building.Building.toLowerCase().includes(q);
      const matchDesc = building.Description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    // 2. Filter by Category
    if (activeFilter) {
      const type = (building.Type || "").toLowerCase();
      
      if (activeFilter === "academic") {
        return type.includes("class") || type.includes("lab") || type.includes("theatre") || type.includes("library") || type.includes("workshop");
      }
      if (activeFilter === "sports") {
        return type.includes("gym") || type.includes("pool") || type.includes("court") || type.includes("pitch") || type.includes("field") || type.includes("sport"); 
      }
      // General match for other keys (dormitory, dining, admin, car park, toilet)
      return type.includes(activeFilter);
    }

    return true;
  });

  // Determine Tile Layer Props based on mapStyle
  let tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  let tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  if (mapStyle === 'satellite') {
    tileLayerUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    tileAttribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  } else if (mapStyle === 'minimal') {
    tileLayerUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  }

  return (
    <MapContainer
      center={[-19.51176, 29.83583]}
      zoom={16}
      scrollWheelZoom={true}
      className="h-full w-full outline-none"
      zoomControl={false}
    >
      <TileLayer
        attribution={tileAttribution}
        url={tileLayerUrl}
      />
      
      {/* Routing Logic */}
      <MapRouting userLocation={userLocation} destination={destination} />

      {filteredBuildings.map((building, index) => {
        const style = getTypeStyles(building.Type || "Unknown");
        return (
          <Marker 
            key={`${building.Building}-${index}`}
            position={[building.Latitude, building.Longitude]}
            icon={getMarkerIcon(building.Type || "Unknown")}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="min-w-[200px] overflow-hidden rounded-lg shadow-sm font-sans mx-[-1px] my-[-1px]">
                  {/* Header Strip */}
                  <div className={`h-2 w-full ${style.bg}`}></div>
                  
                  <div className="p-3 bg-white">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base text-gray-900 leading-tight">
                        {building.Building}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${style.bg} ${style.color}`}>
                        {building.Type}
                      </span>
                    </div>
                    
                    {building.Description && (
                      <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        {building.Description}
                      </p>
                    )}

                    <button 
                      onClick={() => onGetDirections(building.Latitude, building.Longitude)}
                      className={`inline-flex items-center text-xs font-semibold ${style.color} hover:underline mt-1 bg-transparent border-none p-0 cursor-pointer`}
                    >
                      <span>Get Directions</span>
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
