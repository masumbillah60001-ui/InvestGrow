import { Router } from 'express';
import { communicationController, consultationSchema, contactSchema } from '../controllers/communication.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Contact (Public + Protected)
router.post('/contact', validate(contactSchema), communicationController.submitContact);

// Consultations
router.post('/consultations', validate(consultationSchema), communicationController.submitConsultation);
router.get('/consultations/my', authenticate, communicationController.getMyConsultations);

// Admin routes for consultations/messages would go here, protected by middleware

export default router;
