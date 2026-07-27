"use client";

import { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { SafetyReport } from "@/app/api/report/route";

interface SafetyReporterProps {
  enabled: boolean;
  isPinDropMode: boolean;
  onPinDropped: (lat: number, lng: number) => void;
}

const getSafetyIcon = (confirmedCount: number) => {
  const isUrgent = confirmedCount >= 3;
  const color = isUrgent ? "#ef4444" : "#f59e0b";

  return L.divIcon({
    className: "custom-safety-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        color: white;
        font-size: 13px;
        font-weight: bold;
      ">
        ⚠️
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

function MapClickHandler({ active, onPinDrop }: { active: boolean; onPinDrop: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (active) {
        onPinDrop(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function SafetyReporter({ enabled, isPinDropMode, onPinDropped }: SafetyReporterProps) {
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    fetch("/api/report")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(() => {});
  }, [enabled]);

  const handleConfirm = async (id: string) => {
    if (confirmedIds.has(id)) return;
    setConfirmedIds((prev) => new Set(prev).add(id));
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, confirmedCount: r.confirmedCount + 1 } : r))
    );

    try {
      await fetch("/api/report", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {}
  };

  return (
    <>
      <MapClickHandler active={isPinDropMode} onPinDrop={onPinDropped} />

      {enabled &&
        reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={getSafetyIcon(report.confirmedCount)}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-3 min-w-[200px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    {report.category}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Confirmed by {report.confirmedCount}
                  </span>
                </div>
                {report.description && (
                  <p className="text-gray-300 text-xs leading-relaxed">{report.description}</p>
                )}
                <div className="pt-1.5 border-t border-white/[0.08] flex justify-end">
                  <button
                    onClick={() => handleConfirm(report.id)}
                    disabled={confirmedIds.has(report.id)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                      confirmedIds.has(report.id)
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-white/[0.05] text-gray-300 border-white/[0.08] hover:text-white"
                    }`}
                  >
                    {confirmedIds.has(report.id) ? "✓ Confirmed" : "Confirm Issue"}
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
}
