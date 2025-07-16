import SignUp from "@/components/auth/sign-up";
import { getUser } from "@/lib/auth/auth-session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  try {
    const user = await getUser();

    if (user && user?.role !== "admin") {
      redirect("/zoom/dashboard");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la session :", error);
    // Pas de session, continuer vers la page de login
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </div>
  );
}
