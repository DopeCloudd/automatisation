"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  joinUrl?: string;
  password?: string;
  zoomId?: string;
  status: string;
  host: {
    id: string;
    name: string;
    email: string;
    zoomId?: string;
  };
  attendees: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export interface CreateMeetingData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  hostId: string;
  attendeeIds: string[];
}

export interface UpdateMeetingData extends CreateMeetingData {
  id: string;
}

// Clés de requête
export const meetingKeys = {
  all: ["meetings"] as const,
  lists: () => [...meetingKeys.all, "list"] as const,
  list: (filters: string) => [...meetingKeys.lists(), { filters }] as const,
  details: () => [...meetingKeys.all, "detail"] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
};

// Hook pour récupérer toutes les réunions
export function useMeetings() {
  return useQuery({
    queryKey: meetingKeys.lists(),
    queryFn: async (): Promise<Meeting[]> => {
      const response = await fetch("/api/meetings");
      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }
      return response.json();
    },
  });
}

// Hook pour récupérer une réunion spécifique
export function useMeeting(id: string) {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: async (): Promise<Meeting> => {
      const response = await fetch(`/api/meetings/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch meeting");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Hook pour créer une réunion
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMeetingData): Promise<Meeting> => {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create meeting");
      }

      return response.json();
    },
    onSuccess: (newMeeting) => {
      // Invalider et refetch la liste des réunions
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });

      // Ajouter la nouvelle réunion au cache
      queryClient.setQueryData(meetingKeys.detail(newMeeting.id), newMeeting);

      toast.success("Réunion créée avec succès", {
        description: "La réunion a été créée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la création", {
        description: error.message,
      });
    },
  });
}

// Hook pour mettre à jour une réunion
export function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMeetingData): Promise<Meeting> => {
      const response = await fetch(`/api/meetings/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update meeting");
      }

      return response.json();
    },
    onSuccess: (updatedMeeting) => {
      // Mettre à jour le cache
      queryClient.setQueryData(
        meetingKeys.detail(updatedMeeting.id),
        updatedMeeting
      );

      // Invalider la liste pour refetch
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });

      toast.success("Réunion mise à jour avec succès", {
        description: "La réunion a été mise à jour avec succès.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la mise à jour", {
        description: error.message,
      });
    },
  });
}

// Hook pour supprimer une réunion
export function useDeleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/meetings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete meeting");
      }
    },
    onSuccess: (_, deletedId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: meetingKeys.detail(deletedId) });

      // Invalider la liste
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });

      toast.success("Réunion supprimée avec succès", {
        description: "La réunion a été supprimée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la suppression", {
        description: error.message,
      });
    },
  });
}
