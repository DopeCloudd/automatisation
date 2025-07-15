import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchMeetingsByInvitee } from "@/components/zoom/apprenant/mail";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Réunions de l&apos;apprenant
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Réunions de l&apos;apprenant et mail de notification
          </CardTitle>
          <CardDescription>
            Sélectionnez une formatrice et un apprenant pour avoir son listing
            de réunion et créer son mail de notification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchMeetingsByInvitee />
        </CardContent>
      </Card>
    </div>
  );
}
