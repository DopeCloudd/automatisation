export interface UpcomingZoomEvent {
  dept: string;
  host_id: string;
  host_name: string;
  id: string;
  start_time: string;
  topic: string;
}

export interface UpcomingZoomEventsResponse {
  from: string;
  to: string;
  next_page_token: string;
  page_size: number;
  upcoming_events: UpcomingZoomEvent[];
}

export interface CreateZoomMeetingInput {
  topic: string;
  agenda?: string;
  type: number;
  start_time?: string;
  duration?: number;
  timezone?: string;
  password?: string;
}

export interface CreateZoomMeetingResponse {
  id: string;
  join_url: string;
  start_url: string;
  topic: string;
  start_time: string;
  duration: number;
}

export interface ZoomMeetingDetails {
  id: string;
  topic: string;
  agenda: string;
  start_time: string;
  duration: number;
  join_url: string;
  host_id: string;
  settings: Record<string, string | boolean | number>;
  [key: string]: unknown; // Pour supporter d'autres props
}

export interface ZoomMeetingSummary {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  meetings: Array<{
    id: number | string;
    topic: string;
    start_time?: string;
  }>;
}
