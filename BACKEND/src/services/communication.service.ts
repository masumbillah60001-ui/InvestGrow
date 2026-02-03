import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ConsultationStatus, MessageStatus } from '@prisma/client';

export class CommunicationService {
    // Consultations
    async createConsultation(userId: string | undefined, data: any) {
        const { fullName, email, phone, message, preferredDate, preferredTime, investmentGoal, monthlyInvestmentCapacity } = data;

        return await prisma.consultationRequest.create({
            data: {
                userId,
                fullName,
                email,
                phone,
                message,
                preferredDate: preferredDate ? new Date(preferredDate) : null,
                preferredTime,
                investmentGoal,
                monthlyInvestmentCapacity,
                status: ConsultationStatus.PENDING,
            },
        });
    }

    async getConsultations(userId: string) {
        return await prisma.consultationRequest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Admin access
    async getAllConsultations(query: any) {
        const { status, page = 1, limit = 10 } = query;
        const skip = (Number(page) - 1) * Number(limit);

        // Build where clause logic
        const where: any = {};
        if (status) where.status = status as ConsultationStatus;

        const [total, consultations] = await Promise.all([
            prisma.consultationRequest.count({ where }),
            prisma.consultationRequest.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
            })
        ]);

        return { total, consultations };
    }

    async updateConsultationStatus(id: string, data: any) {
        return await prisma.consultationRequest.update({
            where: { id },
            data
        });
    }

    // Contact Messages
    async createContactMessage(userId: string | undefined, data: any) {
        const { fullName, email, phone, subject, message } = data;

        return await prisma.contactMessage.create({
            data: {
                userId,
                fullName,
                email,
                phone,
                subject,
                message,
                status: MessageStatus.NEW
            }
        });
    }
}

export const communicationService = new CommunicationService();
