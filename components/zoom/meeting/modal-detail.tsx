"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useZoomMeetingDetails } from "@/hooks/use-zoom-meetings";
import { CalendarClock, Clock, Loader2, User2 } from "lucide-react";

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

  const timezone =
    typeof data?.timezone === "string" && data.timezone.trim() !== ""
      ? data.timezone
      : "Europe/Paris";

  const formattedDate = data?.start_time
    ? new Date(data.start_time).toLocaleString("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: timezone,
      })
    : "Date inconnue";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la réunion</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p>Chargement des données...</p>
          </div>
        )}

        {error && <p className="text-red-500">{error.message}</p>}

        {data && (
          <div className="space-y-4">
            {/* Sujet */}
            <div>
              <p className="text-sm text-muted-foreground">Sujet</p>
              <p className="font-medium text-lg">{data.topic}</p>
            </div>

            {/* Agenda (si présent) */}
            {data.agenda && data.agenda.trim() !== "" && (
              <div>
                <p className="text-sm text-muted-foreground">Agenda</p>
                <p className="text-sm">{data.agenda}</p>
              </div>
            )}

            {/* Informations principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Date :</strong> {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Durée :</strong> {data.duration} min
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Hôte :</strong> {String(data.host_email)}
                </span>
              </div>
              <div>
                <Badge variant="outline">{String(data.timezone)}</Badge>
              </div>
            </div>

            {/* Bouton rejoindre */}
            <div className="pt-2">
              <a href={data.join_url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">Rejoindre la réunion</Button>
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
