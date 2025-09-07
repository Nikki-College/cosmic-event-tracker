
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start") || "2025-09-01";
  const end = searchParams.get("end") || "2025-09-02";

  const apiKey = process.env.NEXT_PUBLIC_NASA_KEY || "DEMO_KEY";
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.near_earth_objects) return NextResponse.json([]);
    const events = Object.values(data.near_earth_objects).flat();
    return NextResponse.json(events);
  } catch (err) {
    console.error("NASA API error:", err);
    return NextResponse.json([]);
  }
}
