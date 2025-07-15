export const runtime = "nodejs";

import { getZoomToken } from "@/lib/zoom/token-manager";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getZoomToken();

  const response = await fetch("https://api.zoom.us/v2/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Zoom users" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
