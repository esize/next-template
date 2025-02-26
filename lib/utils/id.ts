// lib/utils/id.ts
import { customAlphabet } from "nanoid";

// Using a custom alphabet without ambiguous characters
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 12);

// Create prefixed IDs for different entity types
export function createId(prefix: string): string {
  return `${prefix}_${nanoid()}`;
}
