import { seed } from "drizzle-seed";
import { exit } from "process";

import { db } from ".";
import { teams } from "./schema";

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

  console.log("success! ✅");
  exit(0);
}

void main();
