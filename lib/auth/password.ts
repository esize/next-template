// lib/auth/password.ts
import argon2 from "argon2";

/**
 * Hash a password using argon2
 *
 * @param password - The plain text password to hash
 * @returns Promise resolving to the hashed password
 *
 * @example
 * ```typescript
 * const plainPassword = "securePassword123";
 * const hashedPassword = await hashPassword(plainPassword);
 * // Returns: "$argon2id$v=19$m=65536,t=3,p=4$..."
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Use argon2id variant which provides a balanced approach for protection
    // against both side-channel attacks and GPU attacks
    return await argon2.hash(password, {
      // argon2id is the recommended variant for most use cases
      type: argon2.argon2id,
      // Memory cost: 64 MiB (default is 65536 KiB)
      memoryCost: 65536,
      // Time cost: 3 iterations (default)
      timeCost: 3,
      // Parallelism: 4 threads (default)
      parallelism: 4,
      // Output hash encoded as string
      hashLength: 32,
    });
  } catch (error) {
    console.error("Error hashing password with argon2:", error);
    throw new Error("Password hashing failed");
  }
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
 * const hashedPassword = "$argon2id$v=19$m=65536,t=3,p=4$...";
 * const isMatch = await verifyPassword(plainPassword, hashedPassword);
 * // Returns: true if password matches, false otherwise
 * ```
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error("Error verifying password with argon2:", error);
    // Return false on error rather than throwing, as this is typically
    // used in authentication flows where we want to fail closed
    return false;
  }
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
