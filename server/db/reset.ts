import { reset } from "drizzle-seed";
import { exit } from "process";

import { db } from ".";
import * as schema from "./schema";

async function main() {
  await reset(db, schema);
  console.log("DB Rest successful!");
  exit(0);
}

void main();
