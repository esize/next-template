import { relations } from "drizzle-orm";
import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { createId } from "@/lib/utils/id";

import { users } from "./users";

export const auditEventTypeEnum = pgEnum("audit_event_type", [
  "login_success",
  "login_failure",
  "logout",
  "password_change",
  "password_reset",
  "user_create",
  "user_update",
  "user_delete",
  "team_create",
  "team_update",
  "team_delete",
  "permission_grant",
  "permission_revoke",
]);

export const auditLogs = pgTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId("audit")),
  eventType: auditEventTypeEnum("event_type").notNull(),
  actorId: text("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  targetId: text("target_id"),
  targetType: text("target_type").notNull(),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id],
  }),
}));
