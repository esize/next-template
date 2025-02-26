import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { createId } from "@/lib/utils/id";

import { teams } from "./teams";

export const actionEnum = pgEnum("action", [
  "create",
  "read",
  "update",
  "delete",
  "manage",
]);
export const resourceTypeEnum = pgEnum("resource_type", [
  "team",
  "user",
  "permission",
  "audit_log",
]);

export const permissions = pgTable("permissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId("perm")),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, {
      onDelete: "cascade",
    }),
  action: actionEnum("action").notNull(),
  resourceType: resourceTypeEnum("resource_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const permissionsRelations = relations(permissions, ({ one }) => ({
  team: one(teams, {
    fields: [permissions.teamId],
    references: [teams.id],
  }),
}));
