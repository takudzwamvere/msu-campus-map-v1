import { NextResponse } from "next/server";

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  buildingName: string;
  lat: number;
  lng: number;
  eventDate: string; // ISO date string
  category: "academic" | "sports" | "social" | "ceremony";
}

const MOCK_EVENTS: CampusEvent[] = [
  {
    id: "e1",
    title: "Midlands Innovation Hackathon 2026",
    description: "Annual 24-hour coding challenge for all MSU tech students. Refreshments provided!",
    buildingName: "ICT Complex",
    lat: -19.51280,
    lng: 29.83640,
    eventDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    category: "academic",
  },
  {
    id: "e2",
    title: "Inter-Faculty Football Championship",
    description: "Commerce vs Science finals match. Come support your faculty!",
    buildingName: "MSU Sports Complex",
    lat: -19.51450,
    lng: 29.83670,
    eventDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    category: "sports",
  },
  {
    id: "e3",
    title: "Freshers Welcome & Live DJ Concert",
    description: "Welcome party for new students featuring guest artists and food stalls.",
    buildingName: "Main Dining Hall",
    lat: -19.51400,
    lng: 29.83610,
    eventDate: new Date(Date.now() + 86400000 * 6).toISOString(),
    category: "social",
  },
  {
    id: "e4",
    title: "Public Lecture: AI in Southern Africa",
    description: "Guest lecture by visiting computer science professor.",
    buildingName: "Senate Building",
    lat: -19.51350,
    lng: 29.83550,
    eventDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    category: "academic",
  },
];

export async function GET() {
  return NextResponse.json(MOCK_EVENTS, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
