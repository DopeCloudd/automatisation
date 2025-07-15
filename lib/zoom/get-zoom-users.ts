import { ZoomUser, ZoomUserListResponse } from "@/types/zoom-users";
import { getZoomToken } from "./token-manager";

export async function getZoomUsers(): Promise<ZoomUser[]> {
  const token = getZoomToken();

  const res = await fetch("https://api.zoom.us/v2/users", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Erreur Zoom: " + err);
  }

  const json: ZoomUserListResponse = await res.json();
  return json.users;
}
