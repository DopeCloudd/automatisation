"use client";

import { ZoomUserListResponse } from "@/types/zoom-users";
import { useQuery } from "@tanstack/react-query";

// Clés de requête
export const zoomUserKeys = {
  all: ["zoomUsers"] as const,
  lists: () => [...zoomUserKeys.all, "list"] as const,
  list: (filters: string) => [...zoomUserKeys.lists(), { filters }] as const,
  details: () => [...zoomUserKeys.all, "detail"] as const,
  detail: (id: string) => [...zoomUserKeys.details(), id] as const,
};

// Hook pour récupérer les utilisateurs Zoom (les formatrices)
export function useZoomUsers() {
  return useQuery({
    queryKey: zoomUserKeys.lists(),
    queryFn: async (): Promise<
      { id: string; name: string; email: string }[]
    > => {
      const response = await fetch("/api/zoom/users");
      if (!response.ok) {
        throw new Error("Failed to fetch Zoom users");
      }
      const json: ZoomUserListResponse = await response.json();
      return json.users.map((user) => ({
        id: user.id,
        name: user.first_name + " " + user.last_name,
        email: user.email,
      }));
    },
  });
}
