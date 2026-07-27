"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { CAMPUS_BUILDINGS, type CampusBuilding } from "../constants/campus-data";
import { MAP_LAYERS } from "../constants/map-layers";
import { CAMPUS_BOUNDS_ARRAY } from "../constants/campus-bounds";
import { useState, useEffect } from "react";
import MapRouting, { type RouteSummary } from "./MapRouting";
import MapLayerControl from "./MapLayerControl";
import MapLegend from "./MapLegend";
import { CATEGORY_STYLES, getTypeStyles } from "../constants/campus-styles";
import { getMarkerIcon } from "../constants/map-marker-utils";
import AICampusAssistant from "./AICampusAssistant";

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

const ZoomTracker = ({ onZoomChange }: { onZoomChange: (z: number) => void }) => {
  const map = useMapEvents({
    zoom() { onZoomChange(map.getZoom()); },
  });
  return null;
};

const MapClickHandler = ({
  pendingDestination,
  onLocationSet,
}: {
  pendingDestination: [number, number] | null;
  onLocationSet: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      if (pendingDestination) {
        onLocationSet(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const MyLocationButton = ({ onLocate }: { onLocate: (pos: [number, number]) => void }) => {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleClick = () => {
    setLocating(true);
    map.locate({ setView: false, maxZoom: 18 });
  };

  useMapEvents({
    locationfound(e) {
      setLocating(false);
      map.flyTo(e.latlng, Math.max(map.getZoom(), 17), { animate: true, duration: 1.2 });
      onLocate([e.latlng.lat, e.latlng.lng]);
    },
    locationerror() {
      setLocating(false);
    },
  });

  return (
    <div
      style={{ position: "absolute", bottom: 100, right: 16, zIndex: 1000 }}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleClick}
        title="Go to my location"
        className={`w-10 h-10 rounded-xl shadow-lg border border-white/[0.08] flex items-center justify-center transition-all ${
          locating
            ? "bg-blue-500/30 text-blue-300 animate-pulse"
            : "bg-[#1a1a2e]/90 backdrop-blur-xl text-white hover:bg-[#1a1a2e]"
        }`}
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z" />
        </svg>
      </button>
    </div>
  );
};

export default function Map({
  searchQuery,
  activeFilter,
  userLocation,
  destination,
  onGetDirections,
  focusedLocation,
  selectedBuilding,
  onRouteSummary,
  pendingDestination,
  onMapLocationSet,
  onBuildingSelect,
  onFlyTo,
}: {
  searchQuery: string;
  activeFilter: string | null;
  userLocation: [number, number] | null;
  destination: [number, number] | null;
  onGetDirections: (lat: number, lng: number) => void;
  focusedLocation: [number, number] | null;
  selectedBuilding: string | null;
  onRouteSummary?: (summary: RouteSummary) => void;
  pendingDestination: [number, number] | null;
  onMapLocationSet: (lat: number, lng: number) => void;
  onBuildingSelect?: (building: CampusBuilding) => void;
  onFlyTo?: (lat: number, lng: number, name: string) => void;
}) {
  const [activeLayer, setActiveLayer] = useState(MAP_LAYERS.find(l => l.checked) || MAP_LAYERS[0]);
  const [mapZoom, setMapZoom] = useState(16);
  const showLabels = mapZoom >= 18;

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
      <ZoomTracker onZoomChange={setMapZoom} />
      <MapClickHandler pendingDestination={pendingDestination} onLocationSet={onMapLocationSet} />
      <MyLocationButton onLocate={(pos) => {
        // Surface the located position to the parent via userLocation if needed
        // Currently just pans the map — full GPS flow remains via handleGetDirections
      }} />

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

      {/* AI Campus Assistant — floating FAB + chat panel */}
      <AICampusAssistant onFlyTo={onFlyTo} />

      <MapRouting userLocation={userLocation} destination={destination} onRouteSummary={onRouteSummary} />

      {filteredBuildings.map((building) => {
        const style = getTypeStyles(building.Type || "Unknown");
        const isSelected = building.Building === selectedBuilding;
        return (
          <Marker
            key={`${building.Building}-${building.Latitude}`}
            position={[building.Latitude, building.Longitude]}
            icon={getMarkerIcon(building.Type || "Unknown", building.Building, isSelected, showLabels)}
            zIndexOffset={isSelected ? 1000 : 0}
            eventHandlers={{
              click: () => onBuildingSelect?.(building),
            }}
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
                    onClick={() => {
                      onBuildingSelect?.(building);
                    }}
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    View Details
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
