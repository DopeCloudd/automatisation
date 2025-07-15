"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ZoomUserList from "@/components/zoom/user/list";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Liste des formatrices sur Zoom
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des formatrices</CardTitle>
          <CardDescription>
            Cette page affiche la liste des formatrices. Vous pouvez les gérer
            directement depuis cette interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZoomUserList />
        </CardContent>
      </Card>
    </div>
  );
}
