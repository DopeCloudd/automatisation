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
import { useCreateZoomMeeting } from "@/hooks/use-zoom-meetings";
import { useZoomUsers } from "@/hooks/use-zoom-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const MEETING_TEMPLATES = [
  {
    id: "decouverte_de_la_consultante",
    label: "1er RDV - Découverte de la consultante",
    topic: "1er RDV - Découverte de la consultante",
    agenda: "Rencontre entre la consultante et l'apprenant.",
    duration: 60,
  },
  {
    id: "atelier_1",
    label: "Atelier 1",
    topic: "Atelier 1",
    agenda: "Atelier 1",
    duration: 60,
  },
  {
    id: "atelier_2",
    label: "Atelier 2",
    topic: "Atelier 2",
    agenda: "Atelier 2",
    duration: 60,
  },
  {
    id: "atelier_3",
    label: "Atelier 3",
    topic: "Atelier 3",
    agenda: "Atelier 3",
    duration: 60,
  },
  {
    id: "projet_reseau",
    label: "Mon projet, mon réseau",
    topic: "Mon projet, mon réseau",
    agenda: "Mon projet, mon réseau",
    duration: 60,
  },
  {
    id: "parler_de_mon_projet",
    label: "Parler de mon projet",
    topic: "Parler de mon projet",
    agenda: "Parler de mon projet",
    duration: 60,
  },
  {
    id: "forces_croyances",
    label: "Mes forces, mes croyances",
    topic: "Mes forces, mes croyances",
    agenda: "Mes forces, mes croyances",
    duration: 60,
  },
  {
    id: "concret_sur_mon_projet",
    label: "Plus de concret sur mon projet",
    topic: "Plus de concret sur mon projet",
    agenda: "Plus de concret sur mon projet",
    duration: 60,
  },
  {
    id: "mon_role_dans_le_monde",
    label: "Mon rôle dans le monde",
    topic: "Mon rôle dans le monde",
    agenda: "Mon rôle dans le monde",
    duration: 60,
  },
  {
    id: "mes_4_fondements",
    label: "Mes 4 fondements",
    topic: "Mes 4 fondements",
    agenda: "Mes 4 fondements",
    duration: 60,
  },
  {
    id: "rdv_final",
    label: "Dernier RDV - Synthèse du bilan",
    topic: "Dernier RDV - Synthèse du bilan",
    agenda: "Clôture du bilan et présentation des conclusions.",
    duration: 60,
  },
];

const schema = z.object({
  topic: z.string().min(1, "Le sujet est requis").max(200),
  agenda: z.string().optional(),
  type: z.enum(["1", "2", "3", "8"]),
  start_time: z.string().optional(),
  duration: z.coerce.number().optional(),
  host: z.string().min(1, "Choisissez une formatrice"),
  invitees: z.string().optional(), // Liste d'emails séparés par des virgules
});

type FormData = z.infer<typeof schema>;

export function CreateMeetingForm() {
  const { data: formatrices } = useZoomUsers();
  const { mutateAsync: createMeeting, isPending } = useCreateZoomMeeting();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      topic: "",
      agenda: "",
      type: "2",
      start_time: "",
      duration: 60,
      host: "",
      invitees: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      await createMeeting({
        ...values,
        type: Number(values.type),
      });

      toast.success("Réunion créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création de la réunion:", error);
      toast.error("Erreur lors de la création de la réunion.", {
        description:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 min-w-xl"
      >
        {/* Sélecteur de template */}
        <FormItem>
          <FormLabel>Template</FormLabel>
          <Select
            onValueChange={(templateId) => {
              const template = MEETING_TEMPLATES.find(
                (t) => t.id === templateId
              );
              if (template) {
                form.setValue("topic", template.topic);
                form.setValue("agenda", template.agenda);
                form.setValue("duration", template.duration);
              }
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un template" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {MEETING_TEMPLATES.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formatrice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une formatrice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formatrices?.map((formatrices) => (
                    <SelectItem key={formatrices.id} value={formatrices.id}>
                      {formatrices.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet</FormLabel>
              <FormControl>
                <Input placeholder="Sujet de la réunion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agenda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agenda</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description / ordre du jour"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de réunion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Instantanée</SelectItem>
                  <SelectItem value="2">Planifiée</SelectItem>
                  <SelectItem value="3">Récurrente sans date fixe</SelectItem>
                  <SelectItem value="8">Récurrente avec date fixe</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date et heure de début</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="invitees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invités (emails séparés par des virgules)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="exemple1@email.com, exemple2@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Création..." : "Créer la réunion"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
