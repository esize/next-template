import { seed } from "drizzle-seed";
import { exit } from "process";

import { db } from ".";
import { teams, users } from "./schema";

async function main() {
  await seed(db, { teams }, { count: 1 }).refine((funcs) => ({
    teams: {
      columns: {
        id: funcs.valuesFromArray({ values: ["root"], isUnique: true }),
        name: funcs.valuesFromArray({ values: ["root"], isUnique: true }),
        isRoot: funcs.valuesFromArray({ values: [true] }),
      },
    },
  }));
  await seed(db, { users }, { count: 1 }).refine((funcs) => ({
    users: {
      columns: {
        active: funcs.valuesFromArray({ values: [true] }),
        email: funcs.valuesFromArray({
          values: ["evan@wool.homes"],
          isUnique: true,
        }),
        firstName: funcs.valuesFromArray({ values: ["Evan"] }),
        lastName: funcs.valuesFromArray({ values: ["Sizemore"] }),
        teamId: funcs.valuesFromArray({ values: ["root"] }),
        passwordHash: funcs.valuesFromArray({
          values: [
            "$2y$10$LB/hE59XuHu5dXw2jQ3ppOBKffwQiicRwfmyMOJ3FClEHmJuLMaPu",
          ],
        }),
      },
    },
  }));
  console.log("Great success ✅");
  exit(0);
}

void main();
