import { Router } from 'express';
import { plansController } from '../controllers/plans.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', plansController.getPlans);
router.get('/:id', plansController.getPlan);

// Admin routes
router.use(authenticate);
router.use(authorize([UserRole.ADMIN]));

router.post('/', plansController.createPlan);
router.patch('/:id', plansController.updatePlan);

export default router;
