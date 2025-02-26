"use server";

import { createServerAction } from "zsa";

import { logInUser } from "@/lib/auth/user";
import { logInSchema } from "@/lib/validation/auth";

export const logIn = createServerAction()
  .input(logInSchema)
  .handler(async ({ input }) => {
    return await logInUser(input.email, input.password);
  });
