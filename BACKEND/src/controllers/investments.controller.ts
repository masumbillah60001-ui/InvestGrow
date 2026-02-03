import { Request, Response, NextFunction } from 'express';
import { investmentService } from '../services/investment.service';
import { z } from 'zod';

export const createInvestmentSchema = z.object({
    planId: z.string().uuid(),
    investmentType: z.enum(['SIP', 'LUMPSUM']),
    sipAmount: z.number().positive().optional(),
    sipDate: z.number().min(1).max(28).optional(),
    sipFrequency: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).optional(),
    lumpSumAmount: z.number().positive().optional(),
    startDate: z.string().datetime(), // ISO 8601
});

export class InvestmentsController {
    async createInvestment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const investment = await investmentService.createInvestment(userId, req.body);
            res.status(201).json({ success: true, data: investment });
        } catch (error) { next(error); }
    }

    async getInvestments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const investments = await investmentService.getUserInvestments(userId);
            res.status(200).json({ success: true, data: { investments } });
        } catch (error) { next(error); }
    }

    async getInvestment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const investment = await investmentService.getInvestmentById(req.params.id as string, userId);
            res.status(200).json({ success: true, data: investment });
        } catch (error) { next(error); }
    }
}

export const investmentsController = new InvestmentsController();
