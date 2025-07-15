import type {
  CreateZoomMeetingInput,
  CreateZoomMeetingResponse,
  UpcomingZoomEvent,
  UpcomingZoomEventsResponse,
  ZoomMeetingDetails,
  ZoomMeetingSummary,
} from "@/types/zoom-meetings";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Récupère la liste globale de toutes les réunions Zoom de toutes les formatrices.
 */
export function useAllZoomMeetings() {
  return useQuery<ZoomMeetingSummary[]>({
    queryKey: ["zoom", "allMeetings"],
    queryFn: async () => {
      const res = await fetch("/api/zoom/meeting/list");
      if (!res.ok) {
        throw new Error("Impossible de récupérer les réunions Zoom");
      }
      return res.json();
    },
  });
}

export function useUpcomingZoomEvents() {
  return useQuery({
    queryKey: ["zoom", "upcomingEvents"],
    queryFn: async (): Promise<UpcomingZoomEvent[]> => {
      const res = await fetch("/api/zoom/report/upcoming_events");
      if (!res.ok) {
        throw new Error("Impossible de récupérer les événements Zoom");
      }
      const data: UpcomingZoomEventsResponse = await res.json();
      return data.upcoming_events;
    },
  });
}

export function useCreateZoomMeeting() {
  return useMutation({
    mutationFn: async (
      payload: CreateZoomMeetingInput
    ): Promise<CreateZoomMeetingResponse> => {
      const res = await fetch("/api/zoom/meeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Erreur de création du meeting: ${errorText || res.status}`
        );
      }

      return res.json();
    },
  });
}

export function useZoomMeetingDetails(meetingId?: string) {
  return useQuery<ZoomMeetingDetails>({
    enabled: !!meetingId,
    queryKey: ["zoom", "meetingDetails", meetingId],
    queryFn: async () => {
      if (!meetingId) {
        throw new Error("meetingId is required to fetch meeting details");
      }
      const res = await fetch(
        `/api/zoom/meeting/detail/${encodeURIComponent(meetingId)}`
      );
      if (!res.ok) {
        throw new Error("Impossible de récupérer les détails de la réunion");
      }
      return res.json();
    },
  });
}
