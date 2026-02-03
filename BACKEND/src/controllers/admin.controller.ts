import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export class AdminController {
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const [
                usersCount,
                investmentsCount,
                totalInvestedAgg,
                paymentsCount // Using investments as payments for now
            ] = await Promise.all([
                prisma.user.count(),
                prisma.userInvestment.count(),
                prisma.userInvestment.aggregate({
                    _sum: {
                        totalInvested: true
                    },
                    where: {
                        status: 'ACTIVE' // Only count active investment value? Or all? Usually total invested.
                    }
                }),
                prisma.userInvestment.count() // Duplicate for now as payments = investments
            ]);

            res.status(200).json({
                success: true,
                data: {
                    activeUsers: usersCount,
                    totalInvested: totalInvestedAgg._sum.totalInvested || 0,
                    activeOrders: investmentsCount,
                    totalPayments: paymentsCount
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    // passwordHash: true, // Typically don't send this, but UI showed it. We should mask it or not send it.
                    // The UI showed password, which is bad practice. I will not send hash for security, or send '********'.
                    createdAt: true
                }
            });

            const formattedUsers = users.map(u => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName || ''}`.trim(),
                email: u.email,
                password: '••••••••', // Masked
                date: u.createdAt.toISOString().split('T')[0]
            }));

            res.status(200).json({ success: true, data: formattedUsers });
        } catch (error) {
            next(error);
        }
    }

    async getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await prisma.userInvestment.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    plan: true,
                    user: { select: { firstName: true, lastName: true } }
                }
            });

            const formattedOrders = orders.map(o => ({
                id: o.id,
                productName: o.plan?.planName || 'Custom Plan',
                investAmount: o.totalInvested || o.lumpSumAmount || o.sipAmount || 0,
                status: o.status === 'ACTIVE' ? 'Active' : 'Inactive',
                startDate: o.startDate.toISOString().split('T')[0]
            }));

            res.status(200).json({ success: true, data: formattedOrders });
        } catch (error) {
            next(error);
        }
    }

    async getPayments(req: Request, res: Response, next: NextFunction) {
        try {
            // Deriving payments from Investments for now
            const payments = await prisma.userInvestment.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true } }
                }
            });

            const formattedPayments = payments.map(p => ({
                id: p.id, // Using investment ID as Txn ID
                user: `${p.user.firstName} ${p.user.lastName || ''}`.trim(),
                amount: p.totalInvested || 0,
                method: p.investmentType,
                date: p.createdAt.toISOString().split('T')[0],
                status: 'Success' // Mock status
            }));

            res.status(200).json({ success: true, data: formattedPayments });
        } catch (error) {
            next(error);
        }
    }

    async getLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const logs = await prisma.auditLog.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } }
                }
            });

            res.status(200).json({ success: true, data: logs });
        } catch (error) {
            next(error);
        }
    }
}

export const adminController = new AdminController();
