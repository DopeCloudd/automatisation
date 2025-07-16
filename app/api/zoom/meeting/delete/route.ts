import { getZoomToken } from "@/lib/zoom/token-manager";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID de la réunion requis." },
      { status: 400 }
    );
  }

  const token = await getZoomToken();

  const res = await fetch(`https://api.zoom.us/v2/meetings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: "Erreur Zoom : " + errorText },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
