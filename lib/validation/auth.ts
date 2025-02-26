import { z } from "zod";

export const logInSchema = z.object({
  email: z.string().email("A valid email address is required to login."),
  password: z.string().min(8, "A password must be at least 8 characters"),
});

export const createUserSchema = z.intersection(
  logInSchema,
  z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
);
