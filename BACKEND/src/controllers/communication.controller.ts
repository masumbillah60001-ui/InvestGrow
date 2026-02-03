import { Request, Response, NextFunction } from 'express';
import { communicationService } from '../services/communication.service';
import { z } from 'zod';

export const consultationSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    message: z.string().optional(),
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
    investmentGoal: z.string().optional(),
    monthlyInvestmentCapacity: z.number().optional(),
});

export const contactSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(1),
});

export class CommunicationController {
    // Consultations
    async submitConsultation(req: Request, res: Response, next: NextFunction) {
        try {
            // Optional user ID
            const userId = req.user?.id;
            const result = await communicationService.createConsultation(userId, req.body);
            res.status(201).json({ success: true, message: 'Request submitted', data: result });
        } catch (error) { next(error); }
    }

    async getMyConsultations(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const result = await communicationService.getConsultations(userId);
            res.status(200).json({ success: true, data: result });
        } catch (error) { next(error); }
    }

    // Contact
    async submitContact(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const result = await communicationService.createContactMessage(userId, req.body);
            res.status(201).json({ success: true, message: 'Message sent', data: result });
        } catch (error) { next(error); }
    }
}

export const communicationController = new CommunicationController();
