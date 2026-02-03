import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

export class UserService {
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                panNumber: true,
                kycStatus: true,
                role: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                profileImageUrl: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    async updateProfile(userId: string, data: any) {
        const { firstName, lastName, dateOfBirth, phone, profileImageUrl } = data;

        // Check if phone is taken (if updating phone)
        if (phone) {
            const existingUser = await prisma.user.findUnique({ where: { phone } });
            if (existingUser && existingUser.id !== userId) {
                throw new AppError('Phone number already in use', 409);
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                phone,
                profileImageUrl,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                profileImageUrl: true,
            },
        });

        return updatedUser;
    }

    async changePassword(userId: string, data: any) {
        const { currentPassword, newPassword } = data;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new AppError('Incorrect current password', 401);
        }

        // Optional: Check if new password is same as old
        // if (await bcrypt.compare(newPassword, user.passwordHash)) {
        //   throw new AppError('New password cannot be the same as old password', 400);
        // }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        // Invalidate sessions (logic to be implemented in SessionService)
        return { message: 'Password changed successfully' };
    }
}

export const userService = new UserService();
