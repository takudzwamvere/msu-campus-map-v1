"use client";

import { useEffect } from "react";
import { Polygon, Tooltip, useMap } from "react-leaflet";
import { BUILDING_FOOTPRINTS } from "@/constants/building-footprints";

interface Map3DModeProps {
  enabled: boolean;
}

export default function Map3DMode({ enabled }: Map3DModeProps) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    if (enabled) {
      container.classList.add("map-3d-perspective");
    } else {
      container.classList.remove("map-3d-perspective");
    }
    return () => {
      container.classList.remove("map-3d-perspective");
    };
  }, [enabled, map]);

  if (!enabled) return null;

  return (
    <>
      {BUILDING_FOOTPRINTS.map((b) => (
        <Polygon
          key={b.name}
          positions={b.polygon}
          pathOptions={{
            color: b.color,
            fillColor: b.color,
            fillOpacity: 0.6,
            weight: 3,
          }}
        >
          <Tooltip sticky direction="top">
            <span className="font-bold text-xs">{b.name} (3D Extruded)</span>
          </Tooltip>
        </Polygon>
      ))}
    </>
  );
}
