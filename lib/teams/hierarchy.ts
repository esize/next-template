// lib/teams/hierarchy.ts
import { eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { TeamWithHierarchyInfo } from "@/types/teams";

/**
 * Get all ancestor teams for a given team (parents up the hierarchy)
 *
 * @param teamId - The ID of the team to find ancestors for
 * @returns Promise resolving to an array of ancestor teams with hierarchy info
 *
 * @example
 * ```typescript
 * // Get all parent teams of the Marketing team
 * const marketingTeamId = "team_abc123";
 * const ancestors = await getTeamAncestors(marketingTeamId);
 * // Returns: [{ id: "team_root", name: "Company", depth: 0 }, { id: "team_xyz", name: "Operations", depth: 1 }]
 * ```
 */
export async function getTeamAncestors(
  teamId: string,
): Promise<TeamWithHierarchyInfo[]> {
  // Using Drizzle's recursive CTE capabilities with proper type handling
  const result = await db.execute(sql`
    WITH RECURSIVE team_ancestors AS (
      SELECT *, 0 AS depth FROM ${teams} WHERE id = ${teamId}
      UNION ALL
      SELECT t.*, ta.depth + 1 FROM ${teams} t
      JOIN team_ancestors ta ON t.id = ta.parent_id
    )
    SELECT * FROM team_ancestors WHERE id != ${teamId}
    ORDER BY depth ASC
  `);

  // Convert the query result to the expected type
  return result.rows as unknown as TeamWithHierarchyInfo[];
}

/**
 * Get all descendant teams for a given team (children down the hierarchy)
 *
 * @param teamId - The ID of the team to find descendants for
 * @returns Promise resolving to an array of descendant teams with hierarchy info
 *
 * @example
 * ```typescript
 * // Get all sub-teams under the Operations team
 * const operationsTeamId = "team_xyz";
 * const descendants = await getTeamDescendants(operationsTeamId);
 * // Returns: [
 * //   { id: "team_abc123", name: "Marketing", depth: 1 },
 * //   { id: "team_def456", name: "Finance", depth: 1 },
 * //   { id: "team_ghi789", name: "Digital Marketing", depth: 2 }
 * // ]
 * ```
 */
export async function getTeamDescendants(
  teamId: string,
): Promise<TeamWithHierarchyInfo[]> {
  // Using Drizzle's recursive CTE capabilities with proper type handling
  const result = await db.execute(sql`
    WITH RECURSIVE team_descendants AS (
      SELECT *, 0 AS depth FROM ${teams} WHERE id = ${teamId}
      UNION ALL
      SELECT t.*, td.depth + 1 FROM ${teams} t
      JOIN team_descendants td ON t.parent_id = td.id
    )
    SELECT * FROM team_descendants WHERE id != ${teamId}
    ORDER BY depth ASC
  `);

  // Convert the query result to the expected type
  return result.rows as unknown as TeamWithHierarchyInfo[];
}

/**
 * Check if a team is an ancestor of another team
 *
 * @param ancestorTeamId - The ID of the potential ancestor team
 * @param descendantTeamId - The ID of the potential descendant team
 * @returns Promise resolving to a boolean indicating if the relationship exists
 *
 * @example
 * ```typescript
 * // Check if the Company team is an ancestor of the Marketing team
 * const companyTeamId = "team_root";
 * const marketingTeamId = "team_abc123";
 * const isAncestor = await isTeamAncestor(companyTeamId, marketingTeamId);
 * // Returns: true
 * ```
 */
export async function isTeamAncestor(
  ancestorTeamId: string,
  descendantTeamId: string,
): Promise<boolean> {
  const ancestors = await getTeamAncestors(descendantTeamId);
  return ancestors.some((team) => team.id === ancestorTeamId);
}

/**
 * Check if a team is a descendant of another team
 *
 * @param descendantTeamId - The ID of the potential descendant team
 * @param ancestorTeamId - The ID of the potential ancestor team
 * @returns Promise resolving to a boolean indicating if the relationship exists
 *
 * @example
 * ```typescript
 * // Check if the Marketing team is a descendant of the Company team
 * const marketingTeamId = "team_abc123";
 * const companyTeamId = "team_root";
 * const isDescendant = await isTeamDescendant(marketingTeamId, companyTeamId);
 * // Returns: true
 * ```
 */
export async function isTeamDescendant(
  descendantTeamId: string,
  ancestorTeamId: string,
): Promise<boolean> {
  return isTeamAncestor(ancestorTeamId, descendantTeamId);
}

/**
 * Get the full team hierarchy path as an array (from root to the team)
 *
 * @param teamId - The ID of the team to get the hierarchy path for
 * @returns Promise resolving to an array of teams representing the path from root to the specified team
 *
 * @example
 * ```typescript
 * // Get the full path from root to the Digital Marketing team
 * const digitalMarketingTeamId = "team_ghi789";
 * const path = await getTeamHierarchyPath(digitalMarketingTeamId);
 * // Returns: [
 * //   { id: "team_root", name: "Company", depth: 0 },
 * //   { id: "team_xyz", name: "Operations", depth: 1 },
 * //   { id: "team_abc123", name: "Marketing", depth: 2 },
 * //   { id: "team_ghi789", name: "Digital Marketing", depth: 3 }
 * // ]
 * ```
 */
export async function getTeamHierarchyPath(
  teamId: string,
): Promise<TeamWithHierarchyInfo[]> {
  const ancestors = await getTeamAncestors(teamId);
  const team = await db
    .select()
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1);

  if (!team || team.length === 0) {
    throw new Error(`Team with ID ${teamId} not found`);
  }

  // Add depth property to match the TeamWithHierarchyInfo type
  const teamWithDepth = {
    ...team[0],
    depth: ancestors.length,
  } as TeamWithHierarchyInfo;

  return [...ancestors, teamWithDepth];
}

/**
 * Get the root team of the hierarchy
 *
 * @returns Promise resolving to the root team or null if not found
 *
 * @example
 * ```typescript
 * // Get the root team of the entire organization
 * const rootTeam = await getRootTeam();
 * // Returns: { id: "team_root", name: "Company", depth: 0, isRoot: true, ... }
 * ```
 */
export async function getRootTeam(): Promise<TeamWithHierarchyInfo | null> {
  const rootTeam = await db
    .select()
    .from(teams)
    .where(eq(teams.isRoot, true))
    .limit(1);

  if (!rootTeam || rootTeam.length === 0) {
    return null;
  }

  return {
    ...rootTeam[0],
    depth: 0,
  } as TeamWithHierarchyInfo;
}

/**
 * Get direct children teams for a given team
 *
 * @param teamId - The ID of the parent team
 * @returns Promise resolving to an array of direct child teams
 *
 * @example
 * ```typescript
 * // Get all direct sub-teams under the Operations team
 * const operationsTeamId = "team_xyz";
 * const childTeams = await getDirectChildTeams(operationsTeamId);
 * // Returns: [
 * //   { id: "team_abc123", name: "Marketing", depth: 1 },
 * //   { id: "team_def456", name: "Finance", depth: 1 }
 * // ]
 * ```
 */
export async function getDirectChildTeams(
  teamId: string,
): Promise<TeamWithHierarchyInfo[]> {
  const childTeams = await db
    .select()
    .from(teams)
    .where(eq(teams.parentId, teamId));

  // Add depth property (all direct children are at depth 1 relative to parent)
  return childTeams.map((team) => ({
    ...team,
    depth: 1,
  })) as TeamWithHierarchyInfo[];
}

/**
 * Check if a user has access to a team based on their own team membership
 * (Users can access their own team and any ancestor teams)
 *
 * @param userTeamId - The ID of the team the user belongs to
 * @param targetTeamId - The ID of the team the user is trying to access
 * @returns Promise resolving to a boolean indicating if access is allowed
 *
 * @example
 * ```typescript
 * // Check if a user from the Marketing team can access the Operations team
 * const userTeamId = "team_abc123"; // Marketing
 * const targetTeamId = "team_xyz"; // Operations
 * const hasAccess = await canUserAccessTeam(userTeamId, targetTeamId);
 * // Returns: true (because Operations is an ancestor of Marketing)
 *
 * // Check if a user from the Operations team can access the Marketing team
 * const hasAccess2 = await canUserAccessTeam("team_xyz", "team_abc123");
 * // Returns: false (because Marketing is not an ancestor of Operations)
 * ```
 */
export async function canUserAccessTeam(
  userTeamId: string,
  targetTeamId: string,
): Promise<boolean> {
  // Users can always access their own team
  if (userTeamId === targetTeamId) {
    return true;
  }

  // Check if the target team is an ancestor of the user's team
  return isTeamAncestor(targetTeamId, userTeamId);
}

/**
 * Get the common ancestor team between two teams (lowest common ancestor)
 *
 * @param teamId1 - The ID of the first team
 * @param teamId2 - The ID of the second team
 * @returns Promise resolving to the common ancestor team or null if none exists
 *
 * @example
 * ```typescript
 * // Find the common ancestor between Marketing and Finance teams
 * const marketingTeamId = "team_abc123";
 * const financeTeamId = "team_def456";
 * const commonAncestor = await getCommonAncestorTeam(marketingTeamId, financeTeamId);
 * // Returns: { id: "team_xyz", name: "Operations", depth: 1 }
 * ```
 */
export async function getCommonAncestorTeam(
  teamId1: string,
  teamId2: string,
): Promise<TeamWithHierarchyInfo | null> {
  const ancestors1 = await getTeamAncestors(teamId1);
  const ancestors2 = await getTeamAncestors(teamId2);

  // Create a map of team IDs from the first ancestry path
  const ancestorMap = new Map(ancestors1.map((team) => [team.id, team]));

  // Find the first common ancestor
  for (const team of ancestors2) {
    if (ancestorMap.has(team.id)) {
      return ancestorMap.get(team.id)!;
    }
  }

  return null;
}

/**
 * Build a complete team hierarchy tree starting from a specific team
 *
 * @param rootTeamId - Optional ID of the team to use as the root of the tree. If not provided, the system root team is used.
 * @returns Promise resolving to a team hierarchy tree
 *
 * @example
 * ```typescript
 * // Build the complete team hierarchy tree starting from the root
 * const hierarchyTree = await buildTeamHierarchyTree();
 * // Returns a nested structure representing the entire team hierarchy
 *
 * // Build a partial hierarchy tree starting from the Operations team
 * const operationsTeamId = "team_xyz";
 * const partialTree = await buildTeamHierarchyTree(operationsTeamId);
 * // Returns a nested structure of the Operations team and all its descendants
 * ```
 */
export async function buildTeamHierarchyTree(
  rootTeamId?: string,
): Promise<TeamWithHierarchyInfo> {
  // If no root team ID is provided, get the system root team
  let startTeam: TeamWithHierarchyInfo;

  if (!rootTeamId) {
    const root = await getRootTeam();
    if (!root) {
      throw new Error("No root team found in the system");
    }
    startTeam = root;
  } else {
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, rootTeamId))
      .limit(1);

    if (!team || team.length === 0) {
      throw new Error(`Team with ID ${rootTeamId} not found`);
    }

    startTeam = {
      ...team[0],
      depth: 0,
    } as TeamWithHierarchyInfo;
  }

  // Recursively build the tree
  return await buildTeamTreeRecursive(startTeam);
}

/**
 * Helper function to recursively build a team hierarchy tree
 *
 * @param team - The team to build the subtree for
 * @returns Promise resolving to the team with its children hierarchy
 *
 * @private This is an internal helper function not meant to be used directly
 */
async function buildTeamTreeRecursive(
  team: TeamWithHierarchyInfo,
): Promise<TeamWithHierarchyInfo & { children: TeamWithHierarchyInfo[] }> {
  const children = await getDirectChildTeams(team.id);

  const childrenWithSubtrees = await Promise.all(
    children.map(async (child) => await buildTeamTreeRecursive(child)),
  );

  return {
    ...team,
    children: childrenWithSubtrees,
  };
}
