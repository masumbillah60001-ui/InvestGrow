import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { User, UserRole } from '@prisma/client';

export class AuthService {
    async register(data: any) {
        const { email, phone, password, firstName, lastName, dateOfBirth } = data;

        // Check existing
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) throw new AppError('Email already exists', 409);
            if (existingUser.phone === phone) throw new AppError('Phone already exists', 409);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                phone,
                passwordHash,
                firstName,
                lastName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                role: UserRole.USER,
                isEmailVerified: false,
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken({ sub: user.id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ sub: user.id, sessionId: 'temp-session-id' }); // Placeholder session logic

        // Create session (omitted for brevity in this step, should be here)

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
            accessToken,
            refreshToken,
        };
    }

    async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw new AppError('Invalid email or password', 401);
        }

        if (!user.isActive) {
            throw new AppError('Account is inactive', 403);
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        const accessToken = generateAccessToken({ sub: user.id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ sub: user.id, sessionId: 'temp-session-id' });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                profileImageUrl: user.profileImageUrl,
            },
            accessToken,
            refreshToken,
        };
    }
}

export const authService = new AuthService();
