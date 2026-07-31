"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { isWithinCampus, MAIN_GATE_COORDS } from "../constants/campus-bounds";

export interface RouteSummary {
  distanceMetres: number;
  timeSeconds: number;
}

export default function MapRouting({ 
  userLocation, 
  destination,
  onRouteSummary,
}: { 
  userLocation: [number, number] | null;
  destination: [number, number] | null;
  onRouteSummary?: (summary: RouteSummary) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !destination) return;

    // Gate Coordinates (approximate Main Front Gate)
    const GATE_COORDS = L.latLng(MAIN_GATE_COORDS[0], MAIN_GATE_COORDS[1]);

    const isUserOnCampus = isWithinCampus(userLocation[0], userLocation[1]);

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false,
      show: false,
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 5, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      plan: new L.Routing.Plan(
        [L.latLng(userLocation[0], userLocation[1]), L.latLng(destination[0], destination[1])],
        { createMarker: () => false as unknown as L.Marker, addWaypoints: false }
      ),
      addWaypoints: false,
      collapsible: true,
    }).addTo(map);

    // Custom Focus Logic + surface route summary
    routingControl.on('routesfound', function(e) {
      const route = e.routes[0];

      // Fire route summary callback
      if (onRouteSummary && route?.summary) {
        onRouteSummary({
          distanceMetres: route.summary.totalDistance,
          timeSeconds: route.summary.totalTime,
        });
      }

      if (isUserOnCampus) {
        const bounds = L.latLngBounds([userLocation, destination]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        const bounds = L.latLngBounds([GATE_COORDS, L.latLng(destination[0], destination[1])]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination, onRouteSummary]);

  return null;
}

