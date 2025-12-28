"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix for default marker icon issues in Leaflet when bundling
// We don't need this if we are just drawing lines, but Routing Machine might add markers.
// Assuming global L is patched by leaflet-defaulticon-compatibility, but sometimes explicit handling is safer.

export default function MapRouting({ 
  userLocation, 
  destination 
}: { 
  userLocation: [number, number] | null;
  destination: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 5, opacity: 0.7 }]
      },
      // @ts-ignore - CreateGeocoder is optional and we skip it to keep it simple/dependency-free for now
      geocoder: null, 
      addWaypoints: false,
      draggableWaypoints: false,
      collapsible: true, // Allow collapsing the instructions
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination]);

  return null;
}
