// lib/auth/password.ts
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { Session, User } from "@/types/auth";

import {
  generateRandomPassword,
  hashPassword,
  verifyPassword,
} from "./password";
import { createSession } from "./session";

/**
 * Log in a user
 *
 * @param email - The email submitted by the user
 * @param password - The plain text password submitted by the user
 * @returns Promise resolving to the session or null
 *
 * @example
 * ```typescript
 * const newSession = await logInUser(email, password);
 * // Returns: {id, userId, expiresAt, metadata}
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
/**
 * Create a user
 *
 * @param email - The email to be associated with the user
 * @param password - The password to be created for the user
 * @param firstName - The user's first name
 * @param lastName - The user's last name
 * @returns Promise resolving to the session or null
 *
 * @example
 * ```typescript
 * const createUser = await createUser(email, password, firstName, lastName, teamId);
 * // Returns: "asdf092"
 * ```
 */
export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<User["id"]> {
  const userId = await db
    .insert(users)
    .values({
      email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      teamId: "root",
      role: "admin",
    })
    .returning({ id: users.id });
  return userId[0].id;
}
