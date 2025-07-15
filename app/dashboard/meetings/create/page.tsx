import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateMeetingForm } from "@/components/zoom/meeting/create-form";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Créer une réunion Zoom
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer une réunion Zoom</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour créer une nouvelle réunion
            Zoom.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateMeetingForm />
        </CardContent>
      </Card>
    </div>
  );
}
