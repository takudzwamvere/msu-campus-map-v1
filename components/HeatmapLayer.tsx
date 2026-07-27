"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  /** Whether the layer is currently visible */
  enabled: boolean;
}

export default function HeatmapLayer({ enabled }: HeatmapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const fetchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAndUpdate = async () => {
    try {
      const res = await fetch("/api/presence");
      if (!res.ok) return;
      const points: [number, number, number][] = await res.json();
      if (heatLayerRef.current) {
        heatLayerRef.current.setLatLngs(points as L.HeatLatLngTuple[]);
      }
    } catch {
      // Silently fail — heatmap is decorative
    }
  };

  useEffect(() => {
    if (!enabled) {
      // Remove layer and stop polling
      if (heatLayerRef.current) {
        heatLayerRef.current.remove();
        heatLayerRef.current = null;
      }
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
        fetchIntervalRef.current = null;
      }
      return;
    }

    // Create heat layer
    heatLayerRef.current = L.heatLayer([], {
      radius: 35,
      blur: 25,
      maxZoom: 19,
      max: 1.0,
      minOpacity: 0.25,
      gradient: {
        0.0: "#1e40af",  // dark blue — very few people
        0.3: "#3b82f6",  // blue
        0.5: "#22c55e",  // green — moderate
        0.7: "#eab308",  // amber — busy
        0.9: "#ef4444",  // red — very crowded
        1.0: "#7f1d1d",  // dark red — max
      },
    }).addTo(map);

    // Fetch immediately then poll every 30s
    fetchAndUpdate();
    fetchIntervalRef.current = setInterval(fetchAndUpdate, 30_000);

    return () => {
      if (heatLayerRef.current) {
        heatLayerRef.current.remove();
        heatLayerRef.current = null;
      }
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
        fetchIntervalRef.current = null;
      }
    };
  }, [enabled, map]);

  return null;
}
