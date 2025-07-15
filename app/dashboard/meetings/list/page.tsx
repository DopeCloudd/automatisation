"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ZoomEventsList from "@/components/zoom/meeting/list";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Listing des réunions Zoom
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réunions Zoom</CardTitle>
          <CardDescription>
            Cette page affiche la liste de toutes les réunions Zoom programmées.
            Vous pouvez consulter les détails de chaque réunion et accéder aux
            liens de participation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZoomEventsList />
        </CardContent>
      </Card>
    </div>
  );
}
