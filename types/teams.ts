import { InferSelectModel } from "drizzle-orm";

import { teams } from "@/server/db/schema";

// Base team type from the database schema
export type Team = InferSelectModel<typeof teams>;

// Extended team type with hierarchy information
export interface TeamWithHierarchyInfo extends Team {
  depth: number;
  children?: TeamWithHierarchyInfo[];
}

// Team with full ancestry information
export interface TeamWithAncestry extends Team {
  ancestors: Team[];
}

// Team hierarchy tree node
export interface TeamTreeNode extends Team {
  children: TeamTreeNode[];
  depth: number;
}
