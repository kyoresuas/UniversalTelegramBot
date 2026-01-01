/**
 * Сервис для работы с кэшем
 */
export class CacheService {
  static key = "cacheService";

  private readonly store = new Map<
    string,
    { value: unknown; expiresAt: number | null }
  >();

  /**
   * Получить значение по ключу
   */
  get<T = unknown>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Сохранить значение по ключу
   */
  set(key: string, value: unknown, ttlMs?: number): void {
    const expiresAt = ttlMs ? Date.now() + ttlMs : null;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Удалить ключ
   */
  del(key: string): void {
    this.store.delete(key);
  }

  /**
   * Получить из кэша или вычислить и сохранить
   */
  async wrap<T>(
    key: string,
    producer: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const value = await producer();

    this.set(key, value, ttlMs);

    return value;
  }
}
