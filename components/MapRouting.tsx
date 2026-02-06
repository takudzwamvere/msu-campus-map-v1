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

    // Gate Coordinates (approximate Main Front Gate)
    const GATE_COORDS = L.latLng(-19.510271810936406, 29.841081806506132);
    
    // Check if user is roughly on campus (simple bbox check)
    // Campus bounds from page.tsx:
    // minLat = -19.525... maxLat = -19.507...
    // minLng = 29.822... maxLng = 29.846...
    const isUserOnCampus = 
        userLocation[0] >= -19.525414674850833 && userLocation[0] <= -19.507078465507732 &&
        userLocation[1] >= 29.82276282383294 && userLocation[1] <= 29.846761174571597;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false, // Custom fitting logic below
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 5, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      // @ts-ignore
      geocoder: null, 
      addWaypoints: false,
      collapsible: true, 
    }).addTo(map);

    // Custom Focus Logic
    routingControl.on('routesfound', function(e) {
        if (isUserOnCampus) {
            // Standard behavior: fit the whole route (User -> Destination)
            const routes = e.routes;
            const bounds = L.latLngBounds([userLocation, destination]); // Default tight bounds
            // Or better, use the route instructions bounds but we can just use the points for simplicity & speed
            map.fitBounds(bounds, { padding: [50, 50] });     
        } else {
            // Off-campus behavior: Focus on Campus (Gate -> Destination)
            // This shows the destination context while keeping the line to the user visible if they zoom out
            const bounds = L.latLngBounds([GATE_COORDS, L.latLng(destination[0], destination[1])]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination]);

  return null;
}
