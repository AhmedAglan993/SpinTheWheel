import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/subscription - Get current subscription details
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { tenantId: req.tenant!.tenantId },
            include: {
                invoices: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json(subscription);
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: 'Failed to fetch subscription' });
    }
});

// POST /api/subscription/upgrade - Upgrade subscription plan
router.post('/upgrade', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { plan } = req.body;

        if (!plan || !['Starter', 'Growth', 'Enterprise'].includes(plan)) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        // Update subscription
        const subscription = await prisma.subscription.update({
            where: { tenantId: req.tenant!.tenantId },
            data: { plan }
        });

        // Update tenant plan
        await prisma.tenant.update({
            where: { id: req.tenant!.tenantId },
            data: { plan }
        });

        res.json(subscription);
    } catch (error) {
        console.error('Upgrade subscription error:', error);
        res.status(500).json({ error: 'Failed to upgrade subscription' });
    }
});

// GET /api/subscription/invoices - Get billing history
router.get('/invoices', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { tenantId: req.tenant!.tenantId }
        });

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const invoices = await prisma.invoice.findMany({
            where: { subscriptionId: subscription.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(invoices);
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

export default router;
