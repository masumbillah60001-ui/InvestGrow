import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './utils/logger';
import { connectRedis } from './config/redis';
// import { prisma } from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect to Redis
        await connectRedis();
        logger.info('Connected to Redis');

        // Connect to Database (Prisma connects lazily, but we can verify here)
        // await prisma.$connect();
        // logger.info('Connected to Database');

        app.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            logger.info(`[DEBUG] Server Time: ${new Date().toISOString()}`);
            const secret = process.env.JWT_ACCESS_SECRET || 'access_secret';
            logger.info(`[DEBUG] JWT Secret Loaded: ${secret.substring(0, 3)}... (Length: ${secret.length})`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
