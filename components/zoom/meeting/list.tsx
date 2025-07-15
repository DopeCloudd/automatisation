"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZoomMeetingDetailsModal } from "@/components/zoom/meeting/modal-detail";
import { useAllZoomMeetings } from "@/hooks/use-zoom-meetings";
import { X } from "lucide-react";
import { useState } from "react";

export default function ZoomEventsList() {
  const { data, isLoading, error } = useAllZoomMeetings();
  const [selectedHost, setSelectedHost] = useState<string>("");
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  // emails uniques
  const uniqueHosts =
    data
      ?.map((entry) => entry.user.email)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort() ?? [];

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
            {uniqueHosts.map((email) => (
              <SelectItem key={email} value={email}>
                {email}
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
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSelectedMeetingId(meeting.id.toString())
                      }
                    >
                      Détails
                    </Button>
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
    </div>
  );
}
