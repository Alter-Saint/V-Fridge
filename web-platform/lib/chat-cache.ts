import { Redis } from "@upstash/redis";

export const chatCache = {
    async save(userId: number, message: any) {
    const key = `chat:${userId}`;
    await Redis.fromEnv().lpush(key, JSON.stringify(message));
    await Redis.fromEnv().ltrim(key, 0, 19); 
    await Redis.fromEnv().expire(key, 86400); 
  },

  async get(userId: number) {
    const data = await Redis.fromEnv().lrange(`chat:${userId}`, 0, 5); 
    return data.map((item: string) => JSON.parse(item)).reverse();
  },

  // Повне очищення (якщо треба)
  async clear(userId: number) {
    await Redis.fromEnv().del(`chat:${userId}`);
  }
}