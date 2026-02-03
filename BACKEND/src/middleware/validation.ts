import { Request, Response, NextFunction } from 'express';
import { Schema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.issues.map((e: any) => e.message).join(', ');
            next(new AppError(`Validation Error: ${errorMessage}`, 400));
        } else {
            next(error);
        }
    }
};
