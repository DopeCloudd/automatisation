import { getZoomToken } from "@/lib/zoom/token-manager";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getZoomToken();

  if (!token) {
    return NextResponse.json(
      { error: "Le token Zoom n'est pas configuré." },
      { status: 500 }
    );
  }

  const userId = decodeURIComponent(params.id);

  try {
    const res = await fetch(
      `https://api.zoom.us/v2/users/${encodeURIComponent(
        userId
      )}/meetings?type=upcoming`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Erreur Zoom: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data.meetings || []);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
