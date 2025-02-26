// lib/auth/password.ts
import bcrypt from "bcrypt";

/**
 * Hash a password using bcrypt
 *
 * @param password - The plain text password to hash
 * @returns Promise resolving to the hashed password
 *
 * @example
 * ```typescript
 * const plainPassword = "securePassword123";
 * const hashedPassword = await hashPassword(plainPassword);
 * // Returns: "$2b$10$X9xOe0Tn1Gk..."
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
  // Use a cost factor of 12 for a good balance between security and performance
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 *
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise resolving to a boolean indicating if the password matches
 *
 * @example
 * ```typescript
 * const plainPassword = "securePassword123";
 * const hashedPassword = "$2b$10$X9xOe0Tn1Gk...";
 * const isMatch = await verifyPassword(plainPassword, hashedPassword);
 * // Returns: true if password matches, false otherwise
 * ```
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a secure random password
 *
 * @param length - The length of the password to generate (default: 12)
 * @returns A randomly generated password
 *
 * @example
 * ```typescript
 * const newPassword = generateRandomPassword();
 * // Returns: "a7B9c2D4e5F6"
 *
 * const longerPassword = generateRandomPassword(16);
 * // Returns: "a7B9c2D4e5F6g8H0"
 * ```
 */
export function generateRandomPassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";

  // Create a Uint8Array with the same length as the password
  const randomValues = new Uint8Array(length);
  // Fill it with random values
  crypto.getRandomValues(randomValues);

  // Use the random values to select characters from the charset
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
}
