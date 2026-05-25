"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { CAMPUS_BUILDINGS } from "../constants/campus-data";
import { MAP_LAYERS } from "../constants/map-layers";
import { CAMPUS_BOUNDS_ARRAY } from "../constants/campus-bounds";
import { useState, useEffect } from "react";
import MapRouting from "./MapRouting";
import MapLayerControl from "./MapLayerControl";
import MapLegend from "./MapLegend";
import { CATEGORY_STYLES, getTypeStyles } from "../constants/campus-styles";
import { getMarkerIcon } from "../constants/map-marker-utils";

const MapBoundsController = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const timer = requestAnimationFrame(() => {
      try {
        map.setMaxBounds(CAMPUS_BOUNDS_ARRAY);
        map.setMinZoom(15);
        map.options.minZoom = 15;
      } catch {
        // rAF usually handles timing
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [map]);

  return null;
};

const FlyToController = ({ location }: { location: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!location) return;
    map.flyTo(location, Math.max(map.getZoom(), 18), { animate: true, duration: 1.2 });
  }, [map, location]);
  return null;
};

export default function Map({
  searchQuery,
  activeFilter,
  userLocation,
  destination,
  onGetDirections,
  focusedLocation,
}: {
  searchQuery: string;
  activeFilter: string | null;
  userLocation: [number, number] | null;
  destination: [number, number] | null;
  onGetDirections: (lat: number, lng: number) => void;
  focusedLocation: [number, number] | null;
}) {
  const [activeLayer, setActiveLayer] = useState(MAP_LAYERS.find(l => l.checked) || MAP_LAYERS[0]);

  const filteredBuildings = CAMPUS_BUILDINGS.filter((building) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = building.Building.toLowerCase().includes(q);
      const matchDesc = building.Description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    if (activeFilter) {
      const type = (building.Type || "").toLowerCase();
      const matchedCategory = CATEGORY_STYLES.find(cat => cat.name === activeFilter);
      if (matchedCategory) {
        return matchedCategory.keywords.some(keyword => type.includes(keyword));
      }
      return type.includes(activeFilter.toLowerCase());
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
      zoomControl={false}
      className="h-full w-full outline-none"
    >
      <ZoomControl position="bottomright" />
      <MapBoundsController />
      <FlyToController location={focusedLocation} />

      <TileLayer
        key={activeLayer.name}
        attribution={activeLayer.attribution}
        url={activeLayer.url}
        maxZoom={activeLayer.maxZoom}
        subdomains={activeLayer.subdomains as string | string[] | undefined}
      />

      {/* Layer Control — top right */}
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

      {/* Legend — bottom right, above zoom */}
      <div
        style={{ position: "absolute", bottom: 0, right: 0, zIndex: 999 }}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <MapLegend />
      </div>

      <MapRouting userLocation={userLocation} destination={destination} />

      {filteredBuildings.map((building, index) => {
        const style = getTypeStyles(building.Type || "Unknown");
        return (
          <Marker
            key={`${building.Building}-${building.Latitude}`}
            position={[building.Latitude, building.Longitude]}
            icon={getMarkerIcon(building.Type || "Unknown", building.Building)}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="min-w-[220px] max-w-[280px]">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-[15px] font-bold text-white leading-tight">
                      {building.Building}
                    </h3>
                  </div>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${style.bg} ${style.color}`}>
                    {building.Type}
                  </span>

                  {building.Description && (
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">
                      {building.Description}
                    </p>
                  )}

                  <button
                    onClick={() => onGetDirections(building.Latitude, building.Longitude)}
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Get Directions
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
