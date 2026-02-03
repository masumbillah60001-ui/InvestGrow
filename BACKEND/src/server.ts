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
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
