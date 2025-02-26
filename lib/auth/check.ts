import { redirect } from "next/navigation";

import { getSession } from "./session";

export async function requireAuth(returnTo: string) {
  const session = await getSession();
  if (!session) {
    const ref = encodeURIComponent(returnTo);
    redirect(`/login?returnTo=${ref}`);
  }
  return session;
}
