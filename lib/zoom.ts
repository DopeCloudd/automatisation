interface ZoomMeetingRequest {
  topic: string;
  type: 2; // Scheduled meeting
  start_time: string;
  duration: number;
  timezone: string;
  password?: string;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    join_before_host: boolean;
    mute_upon_entry: boolean;
    watermark: boolean;
    use_pmi: boolean;
    approval_type: number;
    audio: string;
    auto_recording: string;
  };
}

interface ZoomMeetingResponse {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  password: string;
  status: string;
}

export class ZoomAPI {
  private baseUrl = "https://api.zoom.us/v2";
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Zoom API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  async createMeeting(
    userId: string,
    meetingData: ZoomMeetingRequest
  ): Promise<ZoomMeetingResponse> {
    return this.makeRequest(`/users/${userId}/meetings`, {
      method: "POST",
      body: JSON.stringify(meetingData),
    });
  }

  async updateMeeting(
    meetingId: string,
    meetingData: Partial<ZoomMeetingRequest>
  ): Promise<void> {
    return this.makeRequest(`/meetings/${meetingId}`, {
      method: "PATCH",
      body: JSON.stringify(meetingData),
    });
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    return this.makeRequest(`/meetings/${meetingId}`, {
      method: "DELETE",
    });
  }

  async getMeeting(meetingId: string): Promise<ZoomMeetingResponse> {
    return this.makeRequest(`/meetings/${meetingId}`);
  }

  async listMeetings(
    userId: string
  ): Promise<{ meetings: ZoomMeetingResponse[] }> {
    return this.makeRequest(`/users/${userId}/meetings`);
  }

  // Méthode pour obtenir les utilisateurs Zoom (pour synchroniser avec votre base)
  async getUsers(): Promise<{
    users: Array<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    }>;
  }> {
    return this.makeRequest("/users");
  }
}
