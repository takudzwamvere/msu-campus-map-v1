import { NextRequest, NextResponse } from "next/server";

export interface SafetyReport {
  id: string;
  lat: number;
  lng: number;
  category: "lighting" | "path" | "flooding" | "other";
  description?: string;
  confirmedCount: number;
  createdAt: number;
  expiresAt: number;
}

const REPORTS_STORE: SafetyReport[] = [
  {
    id: "sr1",
    lat: -19.51230,
    lng: 29.83590,
    category: "lighting",
    description: "Streetlight flickering / dark path behind China B dorms.",
    confirmedCount: 4,
    createdAt: Date.now() - 3600000 * 5,
    expiresAt: Date.now() + 3600000 * 43,
  },
  {
    id: "sr2",
    lat: -19.51420,
    lng: 29.83650,
    category: "flooding",
    description: "Large water puddle near Sports Complex entrance after heavy rain.",
    confirmedCount: 2,
    createdAt: Date.now() - 3600000 * 2,
    expiresAt: Date.now() + 3600000 * 46,
  },
];

const TTL_MS = 48 * 60 * 60 * 1000;

function purgeExpired() {
  const now = Date.now();
  for (let i = REPORTS_STORE.length - 1; i >= 0; i--) {
    if (REPORTS_STORE[i].expiresAt < now) {
      REPORTS_STORE.splice(i, 1);
    }
  }
}

export async function GET() {
  purgeExpired();
  return NextResponse.json(REPORTS_STORE, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, category, description } = await req.json();

    if (typeof lat !== "number" || typeof lng !== "number" || !category) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const newReport: SafetyReport = {
      id: "sr-" + Math.random().toString(36).slice(2, 9),
      lat,
      lng,
      category,
      description: description?.trim() || undefined,
      confirmedCount: 1,
      createdAt: Date.now(),
      expiresAt: Date.now() + TTL_MS,
    };

    REPORTS_STORE.push(newReport);
    purgeExpired();

    return NextResponse.json(newReport);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const report = REPORTS_STORE.find((r) => r.id === id);
    if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

    report.confirmedCount += 1;
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
