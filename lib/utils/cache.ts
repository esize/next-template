/**
 * Simple in-memory cache implementation
 */
type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    // Check if the entry has expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlMs - Time to live in milliseconds
   */
  set<T>(key: string, value: T, ttlMs: number = 60 * 1000): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Get a value from the cache or set it if not found
   * @param key - Cache key
   * @param factory - Function to create the value if not in cache
   * @param ttlMs - Time to live in milliseconds
   * @returns Cached or newly created value
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs: number = 60 * 1000,
  ): Promise<T> {
    const cachedValue = this.get<T>(key);

    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const newValue = await factory();
    this.set(key, newValue, ttlMs);
    return newValue;
  }

  /**
   * Delete a value from the cache
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const cache = new Cache();
