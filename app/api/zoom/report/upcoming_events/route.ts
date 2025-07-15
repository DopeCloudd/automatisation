export const runtime = "nodejs";

import { getZoomToken } from "@/lib/zoom/token-manager";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getZoomToken();

  // Date du jour au format YYYY-MM-DD
  const today = new Date();
  // Date dans 30 jours au format YYYY-MM-DD
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);

  const response = await fetch(
    `https://api.zoom.us/v2/report/upcoming_events?from=${today
      .toISOString()
      .slice(0, 10)}&to=${next30Days.toISOString().slice(0, 10)}&page_size=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch upcoming Zoom events" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
