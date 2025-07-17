import LoginForm from "@/components/auth/login-form";
import { getUser } from "@/lib/auth/auth-session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
