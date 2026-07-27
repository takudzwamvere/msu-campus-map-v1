import { NextResponse } from "next/server";
import { CAMPUS_BUILDINGS } from "@/constants/campus-data";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return NextResponse.json(CAMPUS_BUILDINGS, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
