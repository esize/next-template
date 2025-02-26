// lib/auth/password.ts
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { Session } from "@/types/auth";

import {
  generateRandomPassword,
  hashPassword,
  verifyPassword,
} from "./password";
import { createSession } from "./session";

/**
 * Hash a password using bcrypt
 *
 * @param password - The plain text password to hash
 * @returns Promise resolving to the hashed password
 *
 * @example
 * ```typescript
 * const plainPassword = "securePassword123";
 * const hashedPassword = await hashPassword(plainPassword);
 * // Returns: "$2b$10$X9xOe0Tn1Gk..."
 * ```
 */
export async function logInUser(
  email: string,
  password: string,
): Promise<Session | null> {
  const emailUser = await db.select().from(users).where(eq(users.email, email));
  if (!emailUser) {
    // Wait before responding
    hashPassword(generateRandomPassword());
    return null;
  }
  const passwordMatch = await verifyPassword(
    password,
    emailUser[0].passwordHash,
  );
  if (passwordMatch) {
    const session = await createSession(emailUser[0].id);
    return session;
  }
  return null;
}
