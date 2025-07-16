"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZoomMeetingDetailsModal } from "@/components/zoom/meeting/modal-detail";
import {
  useAllZoomMeetings,
  useDeleteZoomMeeting,
} from "@/hooks/use-zoom-meetings";
import { X } from "lucide-react";
import { useState } from "react";

export default function ZoomEventsList() {
  const { data, isLoading, error } = useAllZoomMeetings();
  const deleteMeeting = useDeleteZoomMeeting();
  const [selectedHost, setSelectedHost] = useState<string>("");
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  function handleDeleteMeetingConfirm() {
    if (!meetingToDelete) return;
    deleteMeeting.mutate(meetingToDelete);
    setMeetingToDelete(null); // Ferme le modal
  }

  // formatrices uniques (par email, mais on affiche le nom)
  const uniqueHosts =
    data
      ?.map((entry) => ({
        email: entry.user.email,
        name: `${entry.user.first_name} ${entry.user.last_name}`,
      }))
      .filter((v, i, a) => a.findIndex((u) => u.email === v.email) === i)
      .sort((a, b) => a.name.localeCompare(b.name)) ?? [];

  const filteredData = selectedHost
    ? data?.filter((entry) => entry.user.email === selectedHost)
    : data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={selectedHost}
          onValueChange={(value) => setSelectedHost(value)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrer par formatrice" />
          </SelectTrigger>
          <SelectContent>
            {uniqueHosts.map((host) => (
              <SelectItem key={host.email} value={host.email}>
                {host.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedHost && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setSelectedHost("")}
            title="Réinitialiser le filtre"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <ul className="space-y-4">
        {filteredData?.map((entry) => (
          <li key={entry.user.id}>
            <h2 className="font-semibold mb-2">
              {entry.user.first_name} {entry.user.last_name} ({entry.user.email}
              )
            </h2>

            {entry.meetings.length > 0 ? (
              <ul className="space-y-2">
                {entry.meetings.map((meeting) => (
                  <li
                    key={meeting.id}
                    className="border p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{meeting.topic}</h3>
                      <p>
                        Début :{" "}
                        {meeting.start_time
                          ? new Date(meeting.start_time).toLocaleString()
                          : "Non précisé"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setSelectedMeetingId(meeting.id.toString())
                        }
                      >
                        Détails
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          setMeetingToDelete(meeting.id.toString())
                        }
                      >
                        Supprimer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun événement pour cette formatrice.
              </p>
            )}
          </li>
        ))}

        {filteredData?.length === 0 && <p>Aucune formatrice trouvée.</p>}
      </ul>

      {selectedMeetingId && (
        <ZoomMeetingDetailsModal
          meetingId={selectedMeetingId}
          open={!!selectedMeetingId}
          onOpenChange={(open) => {
            if (!open) setSelectedMeetingId(null);
          }}
        />
      )}

      <Dialog
        open={!!meetingToDelete}
        onOpenChange={() => setMeetingToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la réunion</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer cette réunion ? Cette action est
            irréversible.
          </p>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setMeetingToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMeetingConfirm}
              disabled={deleteMeeting.isPending}
            >
              {deleteMeeting.isPending ? "Suppression..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
