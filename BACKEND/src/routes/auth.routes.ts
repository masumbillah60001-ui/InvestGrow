import { Router } from 'express';
import { authController, registerSchema, loginSchema } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Placeholder for other routes
// router.post('/refresh', authController.refresh);
// router.post('/logout', authController.logout);

export default router;
