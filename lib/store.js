import { Redis } from "@upstash/redis";

let redis = null;

function getRedis() {
  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return null;
    }
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

// In-memory fallback for local dev without Redis
let memoryStore = {};

export async function getAllShipments() {
  const r = getRedis();
  if (r) {
    const keys = await r.keys("shipment:*");
    if (keys.length === 0) return [];
    const pipeline = r.pipeline();
    keys.forEach((key) => pipeline.get(key));
    const results = await pipeline.exec();
    return results.filter(Boolean).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  // Memory fallback
  return Object.values(memoryStore).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getShipment(trackingId) {
  const r = getRedis();
  if (r) {
    return await r.get(`shipment:${trackingId}`);
  }
  return memoryStore[trackingId] || null;
}

export async function saveShipment(shipment) {
  const r = getRedis();
  if (r) {
    await r.set(`shipment:${shipment.trackingId}`, shipment);
    return shipment;
  }
  memoryStore[shipment.trackingId] = shipment;
  return shipment;
}

export async function deleteShipment(trackingId) {
  const r = getRedis();
  if (r) {
    await r.del(`shipment:${trackingId}`);
    return true;
  }
  delete memoryStore[trackingId];
  return true;
}

export async function searchShipment(trackingId) {
  const r = getRedis();
  if (r) {
    // Try exact match first
    let shipment = await r.get(`shipment:${trackingId.toUpperCase()}`);
    if (shipment) return shipment;
    // Try case-insensitive search
    const keys = await r.keys("shipment:*");
    for (const key of keys) {
      if (key.toLowerCase() === `shipment:${trackingId.toLowerCase()}`) {
        return await r.get(key);
      }
    }
    return null;
  }
  // Memory fallback
  const id = Object.keys(memoryStore).find(
    (k) => k.toLowerCase() === trackingId.toLowerCase()
  );
  return id ? memoryStore[id] : null;
}
