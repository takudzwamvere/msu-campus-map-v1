"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default function Map() {
  return (
    <MapContainer
      center={[-19.51176, 29.83583]}
      zoom={16}
      scrollWheelZoom={true}
      className="h-full w-full outline-none"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[-19.51176, 29.83583]}>
        <Popup className="custom-popup">
          <div className="p-2 text-center">
            <h3 className="font-bold text-lg">MSU Gweru</h3>
            <p className="text-sm text-gray-600">Main Campus</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
