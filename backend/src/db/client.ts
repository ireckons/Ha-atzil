import Redis from 'ioredis';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL);

redis.on('connect', () => {
  console.log(`🔌 Connected to Redis at ${REDIS_URL.split('@').pop()}`);
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Helper functions to mimic some DB-like access

/**
 * Saves a generic entity as a Hash and adds its ID to a "collection:all" Set.
 */
export async function saveEntity(collection: string, id: string, data: Record<string, any>) {
  const key = `${collection}:${id}`;
  const flatData: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined && v !== null) {
      flatData[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
    }
  }
  await redis.hset(key, flatData);
  await redis.sadd(`${collection}:all`, id);
  return data;
}

/**
 * Fetches an entity Hash by ID.
 */
export async function getEntity<T>(collection: string, id: string): Promise<T | null> {
  const data = await redis.hgetall(`${collection}:${id}`);
  if (Object.keys(data).length === 0) return null;
  return parseRedisHash<T>(data);
}

/**
 * Fetches all entities in a collection.
 */
export async function getAllEntities<T>(collection: string): Promise<T[]> {
  const ids = await redis.smembers(`${collection}:all`);
  if (ids.length === 0) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(`${collection}:${id}`);
  }
  const results = await pipeline.exec();
  if (!results) return [];

  const entities: T[] = [];
  for (const [err, data] of results) {
    if (err || !data || Object.keys(data as any).length === 0) continue;
    entities.push(parseRedisHash<T>(data as Record<string, string>));
  }
  return entities;
}

/**
 * Deletes an entity and removes it from the "all" set.
 */
export async function deleteEntity(collection: string, id: string) {
  await redis.del(`${collection}:${id}`);
  await redis.srem(`${collection}:all`, id);
}

// Utility to parse numeric and json fields back from Redis strings
export function parseRedisHash<T>(hash: Record<string, string>): T {
  const parsed: any = {};
  for (const [k, v] of Object.entries(hash)) {
    if (v === 'true') parsed[k] = true;
    else if (v === 'false') parsed[k] = false;
    else if (!isNaN(Number(v)) && v.trim() !== '') parsed[k] = Number(v);
    else if (v.startsWith('[') || v.startsWith('{')) {
      try { parsed[k] = JSON.parse(v); } catch { parsed[k] = v; }
    } else {
      parsed[k] = v;
    }
  }
  return parsed as T;
}

export { uuidv4 };
