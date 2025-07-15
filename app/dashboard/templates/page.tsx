import { CreateTemplatesForm } from "@/components/templates/create-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Création des documents
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Création des documents</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour générer les documents
            nécessaires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTemplatesForm />
        </CardContent>
      </Card>
    </div>
  );
}
