"use server";

// lib/auth/session.ts
import { cookies } from "next/headers";

import { eq, lt } from "drizzle-orm";

import { createId } from "@/lib/utils/id";
import { db } from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import { Session, SessionUser } from "@/types/auth";

import {
  getSessionCookie,
  removeSessionCookie,
  setSessionCookie,
} from "./cookies";

// Default session duration: 7 days in seconds
const DEFAULT_SESSION_DURATION = 7 * 24 * 60 * 60;

/**
 * Create a new session for a user
 *
 * @param userId - The ID of the user to create a session for
 * @param metadata - Optional metadata to store with the session
 * @param duration - Optional duration in seconds (defaults to 7 days)
 * @returns Promise resolving to the created session
 *
 * @example
 * ```typescript
 * // Create a standard 7-day session
 * const userId = "user_abc123";
 * const session = await createSession(userId);
 *
 * // Create a session with metadata and custom duration (30 days)
 * const session = await createSession(userId,
 *   { userAgent: "Mozilla/5.0...", ipAddress: "192.168.1.1" },
 *   30 * 24 * 60 * 60
 * );
 * ```
 */
export async function createSession(
  userId: string,
  metadata: Record<string, unknown> = {},
  duration: number = DEFAULT_SESSION_DURATION,
): Promise<Session> {
  const expiresAt = new Date(Date.now() + duration * 1000);

  // Get request metadata
  const cookieStore = await cookies();
  const userAgent = cookieStore.get("User-Agent")?.value;

  // Create session in database
  const sessionId = createId("sess");

  // await db.insert(sessions).values({
  //   id: sessionId,
  //   userId,
  //   expiresAt,
  //   userAgent,
  //   ipAddress,
  //   metadata: metadata || {},
  // });

  await db.insert(sessions).values({
    id: sessionId,
    expiresAt,
    userId,
    userAgent,
    metadata,
  });

  // Set session cookie
  setSessionCookie(sessionId, expiresAt);

  return {
    id: sessionId,
    userId,
    expiresAt,
    metadata,
  };
}

/**
 * Get the current session from the request cookies
 *
 * @returns Promise resolving to the session with user data or null if no valid session exists
 *
 * @example
 * ```typescript
 * // In a server component or server action
 * const session = await getCurrentSession();
 * if (session) {
 *   console.log(`User ${session.user.email} is logged in`);
 * } else {
 *   console.log("No active session found");
 * }
 * ```
 */
export async function getSession(): Promise<
  (Session & { user: SessionUser }) | null
> {
  const sessionId = await getSessionCookie();

  if (sessionId === null) {
    return null;
  }

  // Query the session and join with user data
  const result = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        teamId: users.teamId,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!result || result.length === 0) {
    removeSessionCookie();
    return null;
  }

  const session = result[0].session;
  const user = result[0].user;

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    await invalidateSession();

    return null;
  }

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    metadata: session.metadata as Record<string, unknown>,
    user,
  };
}

/**
 * Invalidate a specific session
 *
 * @param sessionId - The ID of the session to invalidate
 * @returns Promise resolving when the session is invalidated
 *
 * @example
 * ```typescript
 * // Invalidate a specific session
 * const sessionId = "sess_abc123";
 * await invalidateSession(sessionId);
 * ```
 */
export async function invalidateSession(): Promise<void> {
  const sessionId = await getSessionCookie();
  if (!sessionId) return;
  await db.delete(sessions).where(eq(sessions.id, sessionId));

  // If this is the current session, remove the cookie
  const currentSessionId = getSessionCookie();
  if ((await currentSessionId) === sessionId) {
    removeSessionCookie();
  }
}

/**
 * Invalidate all sessions for a user
 *
 * @param userId - The ID of the user whose sessions should be invalidated
 * @returns Promise resolving when all sessions are invalidated
 *
 * @example
 * ```typescript
 * // Invalidate all sessions for a user (force logout everywhere)
 * const userId = "user_abc123";
 * await invalidateAllUserSessions(userId);
 * ```
 */
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));

  // If the current session belongs to this user, remove the cookie
  const currentSession = await getSession();
  if (currentSession && currentSession.userId === userId) {
    removeSessionCookie();
  }
}

/**
 * Clean up expired sessions from the database
 *
 * @returns Promise resolving to the number of deleted sessions
 *
 * @example
 * ```typescript
 * // Run as a scheduled task or maintenance operation
 * const deletedCount = await cleanupExpiredSessions();
 * console.log(`Cleaned up ${deletedCount} expired sessions`);
 * ```
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const now = new Date();
  const result = await db
    .delete(sessions)
    .where(lt(sessions.expiresAt, now))
    .returning();

  return result.length;
}

/**
 * Extend the current session duration
 *
 * @param duration - Optional new duration in seconds (defaults to 7 days)
 * @returns Promise resolving to the updated session or null if no session exists
 *
 * @example
 * ```typescript
 * // Extend the current session for another 7 days
 * const updatedSession = await extendSession();
 *
 * // Extend the current session for 30 days
 * const updatedSession = await extendSession(30 * 24 * 60 * 60);
 * ```
 */
export async function extendSession(
  duration: number = DEFAULT_SESSION_DURATION,
): Promise<Session | null> {
  const sessionId = await getSessionCookie();

  if (!sessionId) {
    return null;
  }

  const expiresAt = new Date(Date.now() + duration * 1000);

  // Update session in database
  const result = await db
    .update(sessions)
    .set({
      expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(sessions.id, sessionId))
    .returning();

  if (!result || result.length === 0) {
    removeSessionCookie();
    return null;
  }

  // Update cookie with new expiration
  setSessionCookie(sessionId, expiresAt);

  return {
    id: result[0].id,
    userId: result[0].userId,
    expiresAt: result[0].expiresAt,
    metadata: result[0].metadata as Record<string, unknown>,
  };
}
