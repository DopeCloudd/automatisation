export interface ZoomUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  display_name?: string;
}

export interface ZoomUserListResponse {
  page_count: number;
  page_number: number;
  page_size: number;
  total_records: number;
  next_page_token: string;
  users: ZoomUser[];
}
