"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Calendar, Files, List, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  {
    id: 1,
    name: "Création des réunions Zoom",
    href: "/dashboard/meetings/create",
    icon: Users,
  },
  {
    id: 2,
    name: "Liste des formatrices",
    href: "/dashboard/users/list",
    icon: List,
  },
  {
    id: 3,
    name: "Liste des réunions",
    href: "/dashboard/meetings/list",
    icon: List,
  },
  {
    id: 4,
    name: "Calendrier des réunions",
    href: "/dashboard/meetings/calendar",
    icon: Calendar,
  },
  {
    id: 5,
    name: "Réunions de l'apprenant",
    href: "/dashboard/apprenant/mail",
    icon: User,
  },
  {
    id: 6,
    name: "Génération des documents",
    href: "/dashboard/templates",
    icon: Files,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="flex flex-col w-64 border-r bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">⏰ Automatisation</h1>
        <p className="text-sm text-muted-foreground">Gestion Zoom</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">Navigation</h2>
            <nav className="space-y-1">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <Link key={step.id} href={step.href}>
                    <Button
                      variant={pathname === step.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        pathname === step.href
                          ? "bg-secondary"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {step.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {isAdmin && (
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">Administration</h2>
              <nav className="space-y-1">
                <Link href="/dashboard/admin/users">
                  <Button
                    variant={
                      pathname === "/dashboard/admin/users"
                        ? "secondary"
                        : "ghost"
                    }
                    className={cn(
                      "w-full justify-start",
                      pathname === "/dashboard/admin/users"
                        ? "bg-secondary"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Gestion utilisateurs
                  </Button>
                </Link>
                <Link href="/dashboard/admin/settings">
                  <Button
                    variant={
                      pathname === "/dashboard/admin/settings"
                        ? "secondary"
                        : "ghost"
                    }
                    className={cn(
                      "w-full justify-start",
                      pathname === "/dashboard/admin/settings"
                        ? "bg-secondary"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
