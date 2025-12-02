import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import prizesRoutes from './routes/prizes';
import usersRoutes from './routes/users';
import spinRoutes from './routes/spin';
import subscriptionRoutes from './routes/subscription';
import tenantRoutes from './routes/tenant';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/prizes', prizesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/spin', spinRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/tenant', tenantRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Spin the Wheel API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            prizes: '/api/prizes',
            users: '/api/users',
            spin: '/api/spin',
            subscription: '/api/subscription',
            tenant: '/api/tenant'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${FRONTEND_URL}`);
});

export default app;
