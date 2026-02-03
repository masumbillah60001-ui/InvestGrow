import { createClient } from 'redis';

// Only create/connect if config is present. 
// Otherwise create a mock or null client to fallback safely? 
// Better: Create client only if host is present, but exporting it directly is tricky.
// We will return a dummy object or check before access if we want true optionality.
// For now, let's just make the URL safe and assume 127.0.0.1 if missing locally, 
// BUT for production we likely want to fail or warn.
// Given the user error "redis://undefined:undefined", let's fix the string interpolation
// and allowing skipping if not provided.

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisUrl = redisHost && redisPort
    ? `redis://${redisHost}:${redisPort}`
    : undefined;

const redisClient = redisUrl ? createClient({
    url: redisUrl,
    password: process.env.REDIS_PASSWORD || undefined
}) : null;

if (redisClient) {
    redisClient.on('error', (err) => {
        if (err.code !== 'ECONNREFUSED') {
            console.log('Redis Client Error', err);
        }
    });
    redisClient.on('connect', () => console.log('Redis Client Connected'));
} else {
    console.warn('REDIS_HOST or REDIS_PORT not set. Redis is disabled.');
}

export const connectRedis = async () => {
    if (!redisClient) return;
    try {
        await redisClient.connect();
    } catch (error) {
        console.warn('Redis connection failed - Proceeding without Redis', error);
    }
};

// Export a proxy or make sure consumers handle null?
// Consumers likely expect `redisClient.get` etc.
// Let's allow `redisClient` to be null in types or export a wrapper.
// To avoid refactoring all consumers, we can export a mock client if null.

export default redisClient || {
    isOpen: false,
    get: async () => null,
    set: async () => 'OK',
    del: async () => 0,
    scanIterator: async function* () { return; },
    quit: async () => 'OK',
    disconnect: async () => 'OK',
    // Add other used methods as no-ops
} as any;

