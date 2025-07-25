import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
};
