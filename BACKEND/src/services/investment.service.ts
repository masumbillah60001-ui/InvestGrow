import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { InvestmentType, InvestmentStatus, SipFrequency, RiskLevel } from '@prisma/client';

export class InvestmentService {
    // Plan Management (Admin)
    async createPlan(data: any) {
        const { planCode } = data;
        const existing = await prisma.investmentPlan.findUnique({ where: { planCode } });
        if (existing) throw new AppError('Plan code already exists', 409);

        return await prisma.investmentPlan.create({ data });
    }

    async getPlans(query: any) {
        const { riskLevel, investmentType, minAmount, maxAmount } = query;
        const where: any = { isActive: true };

        if (riskLevel) where.riskLevel = riskLevel as RiskLevel;
        if (investmentType) where.investmentType = investmentType as InvestmentType;
        // Add amount filters logic if needed

        return await prisma.investmentPlan.findMany({
            where,
            orderBy: { displayOrder: 'asc' },
        });
    }

    async getPlanById(id: string) {
        const plan = await prisma.investmentPlan.findUnique({ where: { id } });
        if (!plan) throw new AppError('Plan not found', 404);
        return plan;
    }

    async updatePlan(id: string, data: any) {
        return await prisma.investmentPlan.update({ where: { id }, data });
    }

    // User Investments
    async createInvestment(userId: string, data: any) {
        const { planId, investmentType, sipAmount, sipDate, sipFrequency, lumpSumAmount, startDate } = data;

        const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
        if (!plan) throw new AppError('Plan not found', 404);
        if (!plan.isActive) throw new AppError('Plan is not active', 400);

        // Validate Check Limits (simplified)
        if (investmentType === 'SIP') {
            if (!sipAmount || sipAmount < plan.minInvestmentAmount) {
                throw new AppError(`Minimum SIP amount is ${plan.minInvestmentAmount}`, 400);
            }
        } else {
            if (!lumpSumAmount || lumpSumAmount < plan.minInvestmentAmount) {
                throw new AppError(`Minimum Lumpsum amount is ${plan.minInvestmentAmount}`, 400);
            }
        }

        const investment = await prisma.userInvestment.create({
            data: {
                userId,
                planId,
                investmentType,
                sipAmount,
                sipDate,
                sipFrequency,
                lumpSumAmount,
                startDate: new Date(startDate),
                status: InvestmentStatus.ACTIVE,
                totalInvested: 0, // Initial payment logic would go here
                currentValue: 0
            },
        });

        return investment;
    }

    async getUserInvestments(userId: string) {
        const investments = await prisma.userInvestment.findMany({
            where: { userId },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate returns for each
        return investments.map(inv => {
            const returns = Number(inv.currentValue) - Number(inv.totalInvested);
            const returnsPercentage = Number(inv.totalInvested) > 0 ? (returns / Number(inv.totalInvested)) * 100 : 0;
            return {
                ...inv,
                returns,
                returnsPercentage
            };
        });
    }

    async getInvestmentById(id: string, userId: string) {
        const investment = await prisma.userInvestment.findUnique({
            where: { id },
            include: { plan: true }
        });

        if (!investment) throw new AppError('Investment not found', 404);
        if (investment.userId !== userId) throw new AppError('Access denied', 403);

        return investment;
    }
}

export const investmentService = new InvestmentService();
