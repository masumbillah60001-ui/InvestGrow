import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import { UserRole } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('Authorization token required', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        if (!roles.includes(req.user.role as UserRole)) {
            return next(new AppError('Not authorized to access this route', 403));
        }

        next();
    };
};
