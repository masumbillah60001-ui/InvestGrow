import { Router } from 'express';
import { userController, updateProfileSchema, changePasswordSchema } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.use(authenticate); // Protect all user routes

router.get('/profile', userController.getProfile);
router.patch('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

export default router;
