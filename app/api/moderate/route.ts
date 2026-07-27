import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_SECRET && token !== "dev-admin-secret") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (supabase) {
    const { data, error } = await supabase
      .from("building_contributions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ message: "In mock mode. All contributions auto-approved." });
}

export async function PATCH(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_SECRET && token !== "dev-admin-secret") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, approved } = await req.json();

    if (supabase) {
      const { data, error } = await supabase
        .from("building_contributions")
        .update({ approved })
        .eq("id", id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ ok: true, id, approved });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
