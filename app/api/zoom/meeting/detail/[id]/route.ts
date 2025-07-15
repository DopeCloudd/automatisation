import { getZoomToken } from "@/lib/zoom/token-manager";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "L'ID de la réunion Zoom est requis." },
      { status: 400 }
    );
  }

  const token = getZoomToken();

  if (!token) {
    return NextResponse.json(
      { error: "Le token Zoom n'est pas configuré." },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.zoom.us/v2/meetings/${decodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.error(response);

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Erreur Zoom: " + errorText },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
