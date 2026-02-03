import { Router } from 'express';
import multer from 'multer';
import { kycController } from '../controllers/kyc.controller';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new AppError('Invalid file type. Only JPEG, PNG and PDF allowed.', 400) as any, false);
        }
    },
});

router.use(authenticate);

router.post('/upload', upload.single('file'), kycController.uploadDocument);
router.get('/status', kycController.getStatus);

export default router;
