import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

interface TokenPayload {
    sub: string;
    email: string;
    role: string;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] });
};

export const generateRefreshToken = (payload: { sub: string; sessionId: string }): string => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as jwt.SignOptions['expiresIn'] });
};

export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
    } catch (error) {
        throw new AppError('Invalid or expired access token', 401);
    }
};

export const verifyRefreshToken = (token: string): { sub: string; sessionId: string } => {
    try {
        return jwt.verify(token, REFRESH_SECRET) as { sub: string; sessionId: string };
    } catch (error) {
        throw new AppError('Invalid or expired refresh token', 401);
    }
};
