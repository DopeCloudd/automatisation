import { getZoomToken } from "@/lib/zoom/token-manager";
import { ZoomUser } from "@/types/zoom-users";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getZoomToken();

  const usersResponse = await fetch("https://api.zoom.us/v2/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!usersResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Zoom users" },
      { status: usersResponse.status }
    );
  }

  const usersData = await usersResponse.json();

  // Tableau des utilisateurs avec infos
  const users = usersData.users.map((user: ZoomUser) => ({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  }));

  // Aujourd'hui
  const today = new Date();

  // Calcul du LUNDI de cette semaine
  const dayOfWeek = today.getDay(); // Dimanche=0, Lundi=1, etc.
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const mondayThisWeek = new Date(today);
  mondayThisWeek.setDate(today.getDate() + diffToMonday);

  // Calcul du lundi + 30 jours
  const mondayPlus30 = new Date(mondayThisWeek);
  mondayPlus30.setDate(mondayThisWeek.getDate() + 30);

  // Affichage formaté YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Récupération des réunions pour chaque utilisateur
  const userMeetingsPromises = users.map(async (user: ZoomUser) => {
    const meetingsResponse = await fetch(
      `https://api.zoom.us/v2/users/${encodeURIComponent(
        user.id
      )}/meetings?type=scheduled&from=${formatDate(
        mondayThisWeek
      )}&to=${formatDate(mondayPlus30)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!meetingsResponse.ok) {
      throw new Error(`Failed to fetch meetings for user ${user.email}`);
    }
    const data = await meetingsResponse.json();

    return {
      user,
      meetings: data.meetings || [],
    };
  });

  // Résolution des promesses
  const results = await Promise.all(userMeetingsPromises);

  return NextResponse.json(results);
}
