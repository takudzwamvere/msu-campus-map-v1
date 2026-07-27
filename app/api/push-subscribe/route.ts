import { NextRequest, NextResponse } from "next/server";

// In-memory store for push subscriptions (stub/TODO for Supabase/DB)
const subscriptions: PushSubscription[] = [];

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
    }

    subscriptions.push(subscription);
    return NextResponse.json({ ok: true, count: subscriptions.length });
  } catch {
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
