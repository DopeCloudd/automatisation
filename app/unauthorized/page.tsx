import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Accès non autorisé</CardTitle>
          <CardDescription>
            Vous n&apos;avez pas les permissions nécessaires pour accéder à
            cette page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez
            contacter l&apos;administrateur du système ou retourner à la page
            d&apos;accueil.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
