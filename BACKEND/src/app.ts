import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

// Import routes (placeholders for now)
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import kycRoutes from './routes/kyc.routes';
import plansRoutes from './routes/plans.routes';
import investmentsRoutes from './routes/investments.routes';
import communicationRoutes from './routes/communication.routes';
import blogRoutes from './routes/blog.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: '*', // Temporarily allow all for debugging
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Explicitly allow Authorization
}));

// Request Logging for Debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rate Limiting (Basic global limit)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to InvestGrow API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/kyc', kycRoutes);
app.use('/api/v1/plans', plansRoutes);
app.use('/api/v1/investments', investmentsRoutes);
app.use('/api/v1/communication', communicationRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
