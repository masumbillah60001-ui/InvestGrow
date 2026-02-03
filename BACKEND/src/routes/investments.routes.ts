import { Router } from 'express';
import { investmentsController, createInvestmentSchema } from '../controllers/investments.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createInvestmentSchema), investmentsController.createInvestment);
router.get('/', investmentsController.getInvestments);
router.get('/:id', investmentsController.getInvestment);

export default router;
