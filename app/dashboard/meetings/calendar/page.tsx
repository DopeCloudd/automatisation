"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ZoomMeetingCalendar from "@/components/zoom/meeting/calendar";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calendrier des réunions Zoom
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendrier des réunions Zoom</CardTitle>
          <CardDescription>
            Cette page affiche un calendrier des réunions Zoom programmées. Vous
            pouvez visualiser les réunions par jour et accéder aux détails de
            chaque réunion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZoomMeetingCalendar />
        </CardContent>
      </Card>
    </div>
  );
}
