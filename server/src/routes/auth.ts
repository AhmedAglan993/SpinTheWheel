import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/signup - Register new tenant
router.post('/signup', async (req, res: Response) => {
    try {
        const { businessName, email, password, plan = 'Starter' } = req.body;

        // Validate input
        if (!businessName || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if email already exists
        const existingTenant = await prisma.tenant.findUnique({
            where: { email }
        });

        if (existingTenant) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Calculate next billing date (30 days from now)
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        // Create tenant
        const tenant = await prisma.tenant.create({
            data: {
                name: businessName,
                ownerName: 'Admin',
                email,
                password: hashedPassword,
                status: 'Active',
                plan,
                nextBillingDate,
                logo: `https://placehold.co/400x400/2bbdee/ffffff?text=${businessName.charAt(0)}`,
                primaryColor: '#2bbdee'
            }
        });

        // Create default subscription
        await prisma.subscription.create({
            data: {
                tenantId: tenant.id,
                plan,
                status: 'Active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: nextBillingDate
            }
        });

        // Generate JWT token
        const token = generateToken({
            tenantId: tenant.id,
            email: tenant.email
        });

        // Return tenant info (without password) and token
        const { password: _, ...tenantWithoutPassword } = tenant;

        res.status(201).json({
            tenant: tenantWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// POST /api/auth/login - Login tenant
router.post('/login', async (req, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find tenant
        const tenant = await prisma.tenant.findUnique({
            where: { email }
        });

        if (!tenant) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await comparePassword(password, tenant.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken({
            tenantId: tenant.id,
            email: tenant.email
        });

        // Return tenant info (without password) and token
        const { password: _, ...tenantWithoutPassword } = tenant;

        res.json({
            tenant: tenantWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me - Get current tenant info
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: req.tenant!.tenantId }
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const { password: _, ...tenantWithoutPassword } = tenant;
        res.json(tenantWithoutPassword);
    } catch (error) {
        console.error('Get tenant error:', error);
        res.status(500).json({ error: 'Failed to get tenant info' });
    }
});

export default router;
