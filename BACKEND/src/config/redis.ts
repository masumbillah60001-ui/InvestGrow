import { createClient } from 'redis';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('error', (err) => {
    // Suppress connection refused errors to avoid log flooding
    if (err.code !== 'ECONNREFUSED') {
        console.log('Redis Client Error', err);
    }
});
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.warn('Redis connection failed - Proceeding without Redis', error);
    }
};

export default redisClient;
