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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CLIENTS = [
  { id: "client1", name: "Client 1 - ORIENTATION" },
  { id: "client2", name: "Client 2 - CREATYZ" },
];

const CLIENT_1_BILANS = [
  {
    id: "flash",
    name: "Flash",
    duration: "7h",
    meetings_number: 5,
    price: "1000€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mes fondements" },
      { name: "Rdv 4 : Mon projet, mon réseau" },
      { name: "Rdv 5 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "initiation",
    name: "Initiation",
    duration: "8h",
    meetings_number: 6,
    price: "1550€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "exploration",
    name: "Exploration",
    duration: "9h",
    meetings_number: 6,
    price: "2050€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "progression",
    name: "Progression",
    duration: "11h",
    meetings_number: 7,
    price: "2450€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Plus de concret sur mon projet" },
      { name: "Rdv 7 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "avancement",
    name: "Avancement",
    duration: "12h",
    meetings_number: 8,
    price: "2950€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Parler de mon projet" },
      { name: "Rdv 7 : Plus de concret sur mon projet" },
      { name: "Rdv 8 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "approfondi",
    name: "Approfondi",
    duration: "13h",
    meetings_number: 8,
    price: "3400€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs de vie" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Parler de mon projet" },
      { name: "Rdv 7 : Plus de concret sur mon projet" },
      { name: "Rdv 8 : Synthèse, fin du bilan" },
    ],
  },
];

const CLIENT_2_BILANS = [
  {
    id: "essentiel",
    name: "L'Essentiel",
    duration: "7h",
    meetings_number: 5,
    price: "1050€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mes fondements" },
      { name: "Rdv 4 : Mon projet, mon réseau" },
      { name: "Rdv 5 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "decouverte",
    name: "Le Découverte",
    duration: "8h",
    meetings_number: 6,
    price: "1650€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "evolution",
    name: "L'Évolution",
    duration: "9h",
    meetings_number: 6,
    price: "2150€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "ambitieux",
    name: "L'Ambitieux",
    duration: "11h",
    meetings_number: 7,
    price: "2550€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Plus de concret sur mon projet" },
      { name: "Rdv 7 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "ascension",
    name: "L'Ascension",
    duration: "12h",
    meetings_number: 8,
    price: "3050€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Parler de mon projet" },
      { name: "Rdv 7 : Plus de concret sur mon projet" },
      { name: "Rdv 8 : Synthèse, fin du bilan" },
    ],
  },
  {
    id: "apogee",
    name: "L'Apogée",
    duration: "13h",
    meetings_number: 8,
    price: "3500€",
    meetings: [
      { name: "Rdv 1 : Découverte de la consultante" },
      { name: "Rdv 2 : Mes forces, mes croyances" },
      { name: "Rdv 3 : Mon rôle dans le monde, mes objectifs de vie" },
      { name: "Rdv 4 : Mes fondements" },
      { name: "Rdv 5 : Mon projet, mon réseau" },
      { name: "Rdv 6 : Parler de mon projet" },
      { name: "Rdv 7 : Plus de concret sur mon projet" },
      { name: "Rdv 8 : Synthèse, fin du bilan" },
    ],
  },
];

const CLIENT_FORMATRICES: Record<string, string[]> = {
  client2: ["Cécile BOISSEROLLE", "Clémence RINEAU"],
  client1: ["Aurélie VINCENT BRITO", "Laura DEMARCQ SPALVIERI"],
};

const schema = z.object({
  client: z.enum(["client1", "client2"], {
    required_error: "Le client est requis",
  }),
  bilan: z.string().min(1, "Le bilan est requis"),
  formatrice: z.string().min(1, "Choisissez une formatrice"),
  beneficiaire: z.string().min(1, "Le bénéficiaire est requis"),
  objectifs: z.string().min(1, "Les objectifs sont requis"),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().min(1, "La date de fin est requise"),
});

type FormData = z.infer<typeof schema>;

export function CreateTemplatesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: formatrices } = useZoomUsers();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      client: "client1",
      bilan: "",
      formatrice: "",
      beneficiaire: "",
      objectifs: "",
      start_date: "",
      end_date: "",
    },
  });

  const onInvalid = (errors: FieldErrors<FormData>) => {
    console.error("❌ Erreurs de validation :", errors);
  };

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/zoom/api/generate-pptx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: values.client,
          bilan: values.bilan,
          formatrice: values.formatrice,
          beneficiaire: values.beneficiaire,
          objectifs: values.objectifs,
          start_date: values.start_date,
          end_date: values.end_date,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Génère un nom de fichier de cette forme : Programme APPRONFONDI 8 RDV 13h du Bilan de Compétences - CREATYZ
      const clientName =
        values.client === "client1" ? "ORIENTATION" : "CREATYZ";
      a.download = `Programme ${values.bilan.toUpperCase()} du Bilan de Compétences - ${clientName}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6 min-w-xl"
      >
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("bilan", ""); // Reset bilan quand client change
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CLIENTS.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
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
          name="bilan"
          render={({ field }) => {
            const selectedClient = form.watch("client");
            const bilans =
              selectedClient === "client1" ? CLIENT_1_BILANS : CLIENT_2_BILANS;

            return (
              <FormItem>
                <FormLabel>Bilan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedClient}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un bilan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bilans.map((bilan) => (
                      <SelectItem key={bilan.id} value={bilan.id}>
                        {bilan.name} – {bilan.duration} – {bilan.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="formatrice"
          render={({ field }) => {
            const selectedClient = form.watch("client");

            const allowedFormatrices = formatrices?.filter((f) =>
              CLIENT_FORMATRICES[selectedClient]?.includes(f.name)
            );

            return (
              <FormItem>
                <FormLabel>Formatrice</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une formatrice" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allowedFormatrices?.map((f) => (
                      <SelectItem key={f.id} value={f.name}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="beneficiaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bénéficiaire</FormLabel>
              <FormControl>
                <Input placeholder="Nom du bénéficiaire" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectifs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Les objectifs du bilan</FormLabel>
              <FormControl>
                <Textarea placeholder="Les objectifs du bilan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Date de début" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Date de fin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Génération..." : "Générer le document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
