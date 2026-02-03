import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(authorize([UserRole.ADMIN]));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/orders', adminController.getOrders);
router.get('/payments', adminController.getPayments);
router.get('/logs', adminController.getLogs);

export default router;
