import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimit';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import pickupSlotsRouter from './routes/pickupSlots';

const app = express();

// Trust proxy for rate limiting behind Docker/Nginx
app.set('trust proxy', 1);

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// General rate limit
app.use('/api', generalLimiter);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'haatzil-backend' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/pickup-slots', pickupSlotsRouter);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🔪 HaAtzil API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${config.nodeEnv}`);
});

export default app;
