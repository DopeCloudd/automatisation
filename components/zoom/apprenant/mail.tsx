"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useZoomUsers } from "@/hooks/use-zoom-users";
import { ZoomMeetingDetails } from "@/types/zoom-meetings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1, "Formatrice requise"),
  email: z.string().email("Email invalide"),
});

type FormData = z.infer<typeof schema>;

export function SearchMeetingsByInvitee() {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useZoomUsers();
  const [meetings, setMeetings] = useState<ZoomMeetingDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: "",
      email: "",
    },
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    setSearched(false);
    setMeetings([]);

    try {
      const res = await fetch(
        `/api/zoom/users/${encodeURIComponent(values.userId)}/meetings`
      );
      if (!res.ok)
        throw new Error("Erreur lors de la récupération des réunions");
      const data = await res.json();

      const filtered = data.filter((meeting: ZoomMeetingDetails) =>
        String(meeting.settings?.alternative_hosts || "").includes(values.email)
      );

      setMeetings(filtered);
      setSearched(true);
    } catch (error) {
      console.error(error);
      setMeetings([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  // Génère le texte du mail
  const emailBody = meetings.length
    ? `Bonjour,

Voici le planning de vos ateliers :

${meetings
  .map((m) => {
    const date = new Date(m.start_time);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `• ${dateStr} à ${timeStr} - ${m.topic}\n${m.join_url}`;
  })
  .join("\n\n")}
`
    : "";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* Formatrice */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formatrice</FormLabel>
              {usersLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement des formatrices...
                </div>
              ) : usersError ? (
                <p className="text-red-500">
                  Erreur lors du chargement des formatrices
                </p>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une formatrice" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users?.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email apprenant */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de l&apos;apprenant</FormLabel>
              <FormControl>
                <Input placeholder="prenom.nom@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rechercher les réunions
          </Button>
        </div>

        {/* Résultats */}
        {searched && (
          <div className="space-y-4">
            <h3 className="font-semibold">Résultats :</h3>
            {meetings.length === 0 ? (
              <p>Aucune réunion trouvée avec cet email parmi les invités.</p>
            ) : (
              <>
                {/* Listing */}
                <ul className="space-y-2">
                  {meetings.map((m) => {
                    const date = new Date(m.start_time);
                    return (
                      <li key={m.id} className="border p-3 rounded">
                        <p className="font-medium">
                          <a
                            href={m.join_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            {m.topic}
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Début : {date.toLocaleDateString()} à{" "}
                          {date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                {/* Mail prêt à copier */}
                <div>
                  <FormLabel className="mb-1 block">
                    Texte de mail à copier :
                  </FormLabel>
                  <Textarea
                    readOnly
                    value={emailBody}
                    className="font-mono text-sm"
                    rows={meetings.length * 2 + 4}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
