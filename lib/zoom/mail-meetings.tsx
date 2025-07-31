import type { ZoomMeetingDetails } from "@/types/zoom-meetings";

export async function fetchZoomMeetingsWithInvitee(
  userId: string,
  email: string
): Promise<ZoomMeetingDetails[]> {
  const res = await fetch(
    `/api/zoom/users/meetings?id=${encodeURIComponent(userId)}`
  );

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des réunions");
  }

  const data: ZoomMeetingDetails[] = await res.json();

  const filtered = data.filter(
    (meeting) =>
      Array.isArray(meeting.settings?.meeting_invitees) &&
      meeting.settings.meeting_invitees.some(
        (invitee) => invitee.email === email
      )
  );

  return filtered;
}
