import { InferSelectModel } from "drizzle-orm";

import { sessions, users } from "@/server/db/schema";

// Base user type from the database schema
export type User = InferSelectModel<typeof users>;

// Session type from the database schema
export type DbSession = InferSelectModel<typeof sessions>;

// Simplified user information for session
export type SessionUser = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "role" | "teamId"
>;

// Session with metadata
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  metadata: Record<string, unknown>;
}

// Authentication result
export interface AuthResult {
  success: boolean;
  user?: SessionUser;
  session?: Session;
  error?: string;
}
