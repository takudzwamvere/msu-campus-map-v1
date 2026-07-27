import { NextRequest, NextResponse } from "next/server";

// ── In-memory presence store ───────────────────────────────────────────────
// TODO: Replace with Supabase table when NEXT_PUBLIC_SUPABASE_URL is available.
// Schema: presence(session_id, lat, lng, updated_at)

interface PresenceRecord {
  lat: number;
  lng: number;
  updatedAt: number;
}

const PRESENCE_STORE = new Map<string, PresenceRecord>();
const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Clean up stale sessions */
function purgeStale() {
  const now = Date.now();
  for (const [id, rec] of PRESENCE_STORE) {
    if (now - rec.updatedAt > SESSION_TTL_MS) {
      PRESENCE_STORE.delete(id);
    }
  }
}

/** Bucket active signals into approx 30m radius grid for privacy */
function bucketize(records: PresenceRecord[]): [number, number, number][] {
  // ~0.0003 degrees ≈ 30m
  const BUCKET_SIZE = 0.0003;
  const buckets = new Map<string, { lat: number; lng: number; count: number }>();

  for (const r of records) {
    const bLat = Math.round(r.lat / BUCKET_SIZE) * BUCKET_SIZE;
    const bLng = Math.round(r.lng / BUCKET_SIZE) * BUCKET_SIZE;
    const key = `${bLat.toFixed(5)},${bLng.toFixed(5)}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      buckets.set(key, { lat: bLat, lng: bLng, count: 1 });
    }
  }

  const maxCount = Math.max(...[...buckets.values()].map((b) => b.count), 1);
  return [...buckets.values()].map((b) => [b.lat, b.lng, b.count / maxCount]);
}

// ── GET — return aggregated heat points ───────────────────────────────────
export async function GET() {
  purgeStale();
  const records = [...PRESENCE_STORE.values()];

  if (records.length === 0) {
    // Return a sparse set of mock presence data so the heatmap isn't empty
    // Remove this block once real presence data is flowing
    const MOCK_POINTS: [number, number, number][] = [
      [-19.5132, 29.8358, 0.9],  // Library area
      [-19.5140, 29.8361, 0.7],  // Dining hall
      [-19.5120, 29.8362, 0.5],  // China dorms
      [-19.5128, 29.8364, 0.4],  // ICT Complex
      [-19.5118, 29.8356, 0.3],  // Central area
    ];
    return NextResponse.json(MOCK_POINTS, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(bucketize(records), {
    headers: { "Cache-Control": "no-store" },
  });
}

// ── POST — record a presence signal ───────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { sessionId, lat, lng } = await req.json();
    if (!sessionId || typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Rough campus boundary check — reject signals from outside MSU
    if (lat < -19.525 || lat > -19.500 || lng < 29.828 || lng > 29.845) {
      return NextResponse.json({ error: "Outside campus" }, { status: 400 });
    }

    PRESENCE_STORE.set(sessionId, { lat, lng, updatedAt: Date.now() });
    purgeStale();

    return NextResponse.json({ ok: true, activeUsers: PRESENCE_STORE.size });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
