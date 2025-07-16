import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, List, User, Users } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    name: "Création des réunions Zoom",
    href: "/zoom/dashboard/meetings/create",
    icon: Users,
  },
  {
    id: 2,
    name: "Liste des formatrices",
    href: "/zoom/dashboard/users/list",
    icon: List,
  },
  {
    id: 3,
    name: "Liste des réunions",
    href: "/zoom/dashboard/meetings/list",
    icon: List,
  },
  {
    id: 4,
    name: "Calendrier des réunions",
    href: "/zoom/dashboard/meetings/calendar",
    icon: Calendar,
  },
  {
    id: 5,
    name: "Réunions de l'apprenant",
    href: "/zoom/dashboard/apprenant/mail",
    icon: User,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans l&apos;application de gestion des réunions Zoom.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <Link href={step.href} key={step.id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-4">
                <step.icon className="w-6 h-6 text-primary" />
                <CardTitle className="text-base">{step.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Accéder à {step.name.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
