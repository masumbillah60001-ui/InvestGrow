import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number').optional(),
    profileImageUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export class UserController {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id; // Authenticated user
            const user = await userService.getProfile(userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const updatedUser = await userService.updateProfile(userId, req.body);
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            await userService.changePassword(userId, req.body);
            res.status(200).json({
                success: true,
                message: 'Password changed successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
