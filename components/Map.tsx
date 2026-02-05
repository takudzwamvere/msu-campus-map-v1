"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { CAMPUS_BUILDINGS } from "../constants/campus-data";
import { MAP_LAYERS } from "../constants/map-layers";
import { useState, useEffect } from "react";
import MapRouting from "./MapRouting";
import MapLayerControl from "./MapLayerControl";
import { CATEGORY_STYLES, getTypeStyles } from "../constants/campus-styles";
import { getMarkerIcon } from "../constants/map-marker-utils";

const MapBoundsController = () => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    // Wrap in requestAnimationFrame to ensure map is ready and avoid _leaflet_pos error
    const timer = requestAnimationFrame(() => {
        const bounds: [number, number][] = [
            [-19.525414674850833, 29.82276282383294], // South-West
            [-19.507078465507732, 29.846761174571597] // North-East
        ];
        
        try {
            map.setMaxBounds(bounds);
            map.setMinZoom(15);
            map.options.minZoom = 15;
        } catch (e) {
            console.warn("Retrying bounds setting needed...");
            // Fallback retry if needed, but usually rAF is enough
        }
    });

    return () => cancelAnimationFrame(timer);
  }, [map]);
  
  return null;
};

export default function Map({ 
  searchQuery, 
  activeFilter, 
  userLocation,
  destination,
  onGetDirections
}: { 
  searchQuery: string; 
  activeFilter: string | null; 
  userLocation: [number, number] | null;
  destination: [number, number] | null;
  onGetDirections: (lat: number, lng: number) => void;
}) {

  const [activeLayer, setActiveLayer] = useState(MAP_LAYERS.find(l => l.checked) || MAP_LAYERS[0]);

  // Filter buildings logic...
  const filteredBuildings = CAMPUS_BUILDINGS.filter((building) => {
      // ... (existing filter logic)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = building.Building.toLowerCase().includes(q);
      const matchDesc = building.Description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    if (activeFilter) {
      const type = (building.Type || "").toLowerCase();
      
      if (activeFilter === "academic") {
        return type.includes("class") || type.includes("lab") || type.includes("theatre") || type.includes("library") || type.includes("workshop");
      }
      if (activeFilter === "sports") {
        return type.includes("gym") || type.includes("pool") || type.includes("court") || type.includes("pitch") || type.includes("field") || type.includes("sport"); 
      }
      return type.includes(activeFilter);
    }

    return true;
  });

  return (
    <MapContainer
      center={[-19.51176, 29.83583]}
      zoom={16}
      minZoom={15}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={true}
      zoomControl={false} // Turbo: Disable default top-left
      className="h-full w-full outline-none"
    >
      <ZoomControl position="bottomright" /> {/* Turbo: Add custom position */}
      <MapBoundsController />
      
      <TileLayer
        key={activeLayer.name}
        attribution={activeLayer.attribution}
        url={activeLayer.url}
        maxZoom={activeLayer.maxZoom}
        subdomains={activeLayer.subdomains as string | string[] | undefined}
      />

      {/* Custom Layer Control - outside Leaflet UI flow but inside map container logic if needed, 
          actually it's better placed inside as a child or overlay. 
          Since it's absolutely positioned, we can render it here. */}
      
      {/* Just a div overlay if we want it to be part of map context but we need to stop propagation if clicked?
          Actually, let's put it "outside" the MapContainer in the caller? 
          No, the user wants it ON the map. If we put it here, we need to make sure clicks don't drag map.
          Leaflet handles controls specially. 
          Ideally, we use a portal or just absolute div with z-index. 
          Line 95 onwards replaced LayersControl.
       */}
       
      {/* We can use a simple customized control wrapper or just absolute div since MapContainer has 'relative'. */}
      <div className="leaflet-top leaflet-right">
          <div className="leaflet-control">
             {/* We can't easily inject React components into Leaflet's control pane without a portal.
                 However, absolute positioning on top of the MapContainer works fine if z-index is high enough.
                 Let's place it as a direct child of MapContainer? No, MapContainer children must be Map components or react-leaflet components.
                 Wait, standard HTML elements work inside MapContainer but they move with map if not careful? 
                 Actually, standard <div> inside MapContainer renders inside the map pane.
                 For fixed UI, it's better to verify if MapContainer supports direct HTML children overlay.
                 
                  BETTER APPROACH: "MapCaller" has a wrapper around Map.
                 But "Map" is the one with the state.
                 
                 Solution: Render a div that is absolutely positioned.
                 For React Leaflet v4, children are rendered.
             */}
          </div>
      </div>
      
      {/* Using my custom control as a simple absolute overlay. 
          To prevent map interactions: onMouseDown={(e) => e.stopPropagation()} 
      */}
      <div 
        style={{ position: "absolute", top: 0, right: 0, zIndex: 1000 }}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
         <MapLayerControl 
            activeLayerName={activeLayer.name}
            onLayerSelect={setActiveLayer}
         />
      </div>

      
      {/* Routing Logic */}
      <MapRouting userLocation={userLocation} destination={destination} />

      {filteredBuildings.map((building, index) => {
        const style = getTypeStyles(building.Type || "Unknown");
        return (
          <Marker 
            key={`${building.Building}-${index}`}
            position={[building.Latitude, building.Longitude]}
            icon={getMarkerIcon(building.Type || "Unknown", building.Building)}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="min-w-[200px] overflow-hidden shadow-sm font-sans">
                  
                  <div className="p-3 bg-white">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base text-gray-900 leading-tight">
                        {building.Building}
                      </h3>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-xs ${style.bg} ${style.color}`}>
                        {building.Type}
                      </span>
                    </div>
                    
                    {building.Description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {building.Description}
                      </p>
                    )}

                    <button 
                      onClick={() => onGetDirections(building.Latitude, building.Longitude)}
                      className={`inline-flex items-center text-sm ${style.color} hover:underline mt-1 bg-transparent border-none p-0 cursor-pointer`}
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
