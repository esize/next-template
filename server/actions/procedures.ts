"use server";

import { createServerActionProcedure } from "zsa";

import { requireAuth } from "@/lib/auth/check";

const authedProcedure = createServerActionProcedure().handler(async () => {
  try {
    const user = await requireAuth();

    return user;
  } catch {
    throw new Error("User not authenticated");
  }
});

export default authedProcedure;
