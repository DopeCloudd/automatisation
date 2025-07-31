import { getZoomToken } from "@/lib/zoom/token-manager";
import { ZoomMeetingDetails } from "@/types/zoom-meetings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "L'ID de l'utilisateur Zoom est requis." },
      { status: 400 }
    );
  }

  const token = await getZoomToken();

  if (!token) {
    return NextResponse.json(
      { error: "Le token Zoom n'est pas configuré." },
      { status: 500 }
    );
  }

  const userId = decodeURIComponent(id);

  try {
    // Récupère les réunions de l'utilisateur Zoom
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

    // On parcourt les réunions et pour chaque réunion, on récupère les détails
    const meetings: ZoomMeetingDetails[] = await Promise.all(
      data.meetings.map(async (meeting: ZoomMeetingDetails) => {
        const meetingDetailsRes = await fetch(
          `https://api.zoom.us/v2/meetings/${meeting.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!meetingDetailsRes.ok) {
          const errorText = await meetingDetailsRes.text();
          throw new Error(`Erreur Zoom: ${errorText}`);
        }

        return await meetingDetailsRes.json();
      })
    );

    return NextResponse.json(meetings);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
