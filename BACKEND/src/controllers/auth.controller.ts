import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { z } from 'zod';

// Zod Schemas
export const registerSchema = z.object({
    email: z.string().email(),
    phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
