import { Request, Response, NextFunction } from 'express';
import { investmentService } from '../services/investment.service';

export class PlansController {
    async createPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await investmentService.createPlan(req.body);
            res.status(201).json({ success: true, data: plan });
        } catch (error) { next(error); }
    }

    async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await investmentService.getPlans(req.query);
            res.status(200).json({ success: true, data: { plans } });
        } catch (error) { next(error); }
    }

    async getPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await investmentService.getPlanById(req.params.id as string);
            res.status(200).json({ success: true, data: plan });
        } catch (error) { next(error); }
    }

    async updatePlan(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await investmentService.updatePlan(req.params.id as string, req.body);
            res.status(200).json({ success: true, data: plan });
        } catch (error) { next(error); }
    }
}

export const plansController = new PlansController();
