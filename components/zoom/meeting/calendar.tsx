"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAllZoomMeetings } from "@/hooks/use-zoom-meetings";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Loader2 } from "lucide-react";

const COLORS = [
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#f39c12",
  "#e74c3c",
  "#2ecc71",
  "#e67e22",
];

export default function ZoomMeetingCalendar() {
  const { data, isLoading, error } = useAllZoomMeetings();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin w-4 h-4" />
        Chargement du calendrier...
      </div>
    );
  }

  if (error) {
    return <p>Erreur : {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p>Aucune réunion trouvée.</p>;
  }

  // Associer chaque utilisateur à une couleur unique
  const uniqueUsers = Array.from(
    new Map(
      data.map((d) => [
        d.user.email,
        {
          email: d.user.email,
          name: `${d.user.first_name} ${d.user.last_name}`,
        },
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const emailToColor = uniqueUsers.reduce((acc, user, index) => {
    acc[user.email] = COLORS[index % COLORS.length];
    return acc;
  }, {} as Record<string, string>);

  // Transforme les données en événements FullCalendar
  const events = data.flatMap((entry) =>
    entry.meetings.map((meeting) => ({
      id: meeting.id.toString(),
      title: meeting.topic,
      start: meeting.start_time,
      url: `https://zoom.us/j/${meeting.id}`,
      backgroundColor: emailToColor[entry.user.email],
      borderColor: emailToColor[entry.user.email],
      extendedProps: {
        host: `${entry.user.first_name} ${entry.user.last_name}`,
        email: entry.user.email,
      },
    }))
  );

  return (
    <Card className="p-4 space-y-4">
      {/* Légende */}
      <div className="flex flex-wrap gap-2">
        {uniqueUsers.map((user) => (
          <Badge
            key={user.email}
            style={{
              backgroundColor: emailToColor[user.email],
              color: "white",
            }}
          >
            {user.name}
          </Badge>
        ))}
      </div>

      {/* Calendrier FullCalendar */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={frLocale}
        timeZone="local"
        height="80vh"
        expandRows={true}
        slotMinTime="09:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        weekends={false}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          list: "Liste",
        }}
        events={events}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            window.open(info.event.url, "_blank");
          }
        }}
        eventContent={(arg) => (
          <div
            title={arg.event.title}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <b>{arg.timeText}</b> <span>{arg.event.title}</span>
          </div>
        )}
      />
    </Card>
  );
}
