import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { createId } from "@/lib/utils/id";

import { permissions } from "./permissions";
import { users } from "./users";

export const teams = pgTable(
  "teams",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId("team")),
    name: text("name").notNull(),
    description: text("description"),
    parentId: text("parent_id"),
    isRoot: boolean("is_root").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "parentTeam",
    }),
  ],
);
export const teamsRelations = relations(teams, ({ one, many }) => ({
  parent: one(teams, {
    fields: [teams.parentId],
    references: [teams.id],
    relationName: "childToParent",
  }),
  children: many(teams, { relationName: "childToParent" }),
  users: many(users),
  permissions: many(permissions),
}));
