"use server";

import { createServerAction } from "zsa";

import { createUser, logInUser } from "@/lib/auth/user";
import { createUserSchema, logInSchema } from "@/lib/validation/auth";

export const logIn = createServerAction()
  .input(logInSchema)
  .handler(async ({ input }) => {
    console.log(input);
    console.log(await logInUser(input.email, input.password));
  });

export const create = createServerAction()
  .input(createUserSchema)
  .handler(async ({ input }) => {
    console.log(input);
    console.log(
      await createUser(
        input.email,
        input.password,
        input.firstName,
        input.lastName,
      ),
    );
    return null;
  });
