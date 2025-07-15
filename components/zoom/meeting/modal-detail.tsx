"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useZoomMeetingDetails } from "@/hooks/use-zoom-meetings";
import { Loader2 } from "lucide-react";

interface Props {
  meetingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ZoomMeetingDetailsModal({
  meetingId,
  open,
  onOpenChange,
}: Props) {
  const { data, isLoading, error } = useZoomMeetingDetails(meetingId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la réunion</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p>Chargement...</p>
          </div>
        )}
        {error && <p className="text-red-500">{error.message}</p>}
        {data && (
          <div className="space-y-2">
            <p>
              <strong>Sujet :</strong> {data.topic}
            </p>
            <p>
              <strong>Agenda :</strong> {data.agenda || "—"}
            </p>
            <p>
              <strong>Début :</strong>{" "}
              {new Date(data.start_time).toLocaleString()}
            </p>
            <p>
              <strong>Durée :</strong> {data.duration} min
            </p>
            <p>
              <strong>Lien de participation :</strong>{" "}
              <a
                href={data.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                Rejoindre
              </a>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
