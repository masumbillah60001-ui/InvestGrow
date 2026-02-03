import { Request, Response, NextFunction } from 'express';
import { kycService } from '../services/kyc.service';
import { AppError } from '../middleware/errorHandler';

// Helper to remove Multer type coupling in controller signature if preferred, 
// but using standard Express types is fine.
export class KycController {
    async uploadDocument(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            const userId = req.user!.id;
            const result = await kycService.uploadDocument(userId, req.file, req.body);

            res.status(201).json({
                success: true,
                message: 'Document uploaded successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const result = await kycService.getKycStatus(userId);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const kycController = new KycController();
