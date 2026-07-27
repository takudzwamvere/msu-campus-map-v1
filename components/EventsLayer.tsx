"use client";

import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { CampusEvent } from "@/app/api/events/route";

interface EventsLayerProps {
  enabled: boolean;
}

const getEventMarkerIcon = (category: CampusEvent["category"]) => {
  const colors: Record<CampusEvent["category"], string> = {
    academic: "#3b82f6",
    sports: "#f97316",
    social: "#ec4899",
    ceremony: "#8b5cf6",
  };

  const bg = colors[category] || "#3b82f6";

  return L.divIcon({
    className: "custom-event-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${bg};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: justify-center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        color: white;
        font-size: 14px;
        line-height: 28px;
        text-align: center;
      ">
        📅
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export default function EventsLayer({ enabled }: EventsLayerProps) {
  const [events, setEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    if (!enabled) return;
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => {});
  }, [enabled]);

  if (!enabled) return null;

  const downloadIcs = (event: CampusEvent) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MSU Campus Map//Events//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.buildingName}
DTSTART:${new Date(event.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {events.map((ev) => (
        <Marker
          key={ev.id}
          position={[ev.lat, ev.lng]}
          icon={getEventMarkerIcon(ev.category)}
        >
          <Popup className="custom-popup" closeButton={false}>
            <div className="p-3 min-w-[220px]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  {ev.category}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(ev.eventDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h4 className="text-white text-sm font-bold leading-snug mb-1">{ev.title}</h4>
              <p className="text-gray-400 text-xs mb-2 leading-relaxed">{ev.description}</p>
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.08]">
                <span className="text-[10px] text-gray-500">📍 {ev.buildingName}</span>
                <button
                  onClick={() => downloadIcs(ev)}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add to Calendar
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
