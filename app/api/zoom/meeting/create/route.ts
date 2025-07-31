import { getZoomToken } from "@/lib/zoom/token-manager";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    host,
    topic,
    agenda,
    start_time,
    duration,
    timezone = "Europe/Paris",
    type,
    invitees,
  } = await req.json();

  if (!host || !invitees || !topic || !agenda || !start_time) {
    return NextResponse.json(
      { error: "Topic, agenda, and start_time are required." },
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

  const payload = {
    topic,
    agenda,
    type: type ? Number(type) : 2,
    start_time: start_time ? new Date(start_time).toISOString() : undefined,
    duration: duration,
    timezone,
    default_password: false,
    settings: {
      host_video: false,
      participant_video: false,
      join_before_host: false,
      mute_upon_entry: true,
      waiting_room: true,
      meeting_invitees: invitees
        ?.split(",")
        .map((email: string) => email.trim())
        .filter((email: string) => email)
        .map((email: string) => ({ email })),
      calendar_type: 2,
      email_notification: false,
      push_change_to_calendar: true,
    },
  };

  const response = await fetch(
    `https://api.zoom.us/v2/users/${host}/meetings`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

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
