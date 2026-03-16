import { LRUCache } from "lru-cache";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class TTLCache<T> {
  private lru: LRUCache<string, CacheEntry<T>>;
  private hitCount = 0;
  private missCount = 0;

  constructor(max: number) {
    this.lru = new LRUCache<string, CacheEntry<T>>({ max });
  }

  set(key: string, data: T, ttlMs: number): void {
    this.lru.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  get(key: string): T | null {
    const entry = this.lru.get(key);
    if (!entry) {
      this.missCount += 1;
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.lru.delete(key);
      this.missCount += 1;
      return null;
    }
    this.hitCount += 1;
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  get hitRate(): number {
    const total = this.hitCount + this.missCount;
    if (!total) return 0;
    return this.hitCount / total;
  }
}

export const ohlcvCache = new TTLCache<number[][]>(2_000);
export const symbolCache = new TTLCache<string[]>(100);
export const exchangeStatusCache = new TTLCache<{ online: boolean; updatedAt: number }>(50);

export { TTLCache };
