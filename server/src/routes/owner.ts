import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Middleware to check if user is owner
const requireOwner = async (req: AuthRequest, res: Response, next: Function) => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: req.tenant!.tenantId }
        });

        if (!tenant?.isOwner) {
            return res.status(403).json({ error: 'Access denied. Owner privileges required.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization check failed' });
    }
};

// GET /api/owner/tenants - Get all tenants (owner only)
router.get('/tenants', authenticate, requireOwner, async (req: AuthRequest, res: Response) => {
    try {
        const tenants = await prisma.tenant.findMany({
            where: { isOwner: false }, // Exclude owner from list
            select: {
                id: true,
                name: true,
                ownerName: true,
                email: true,
                status: true,
                logo: true,
                createdAt: true,
                _count: {
                    select: {
                        projects: true,
                        spinHistory: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(tenants);
    } catch (error) {
        console.error('Get tenants error:', error);
        res.status(500).json({ error: 'Failed to fetch tenants' });
    }
});

// GET /api/owner/stats - Get platform-wide stats (owner only)
router.get('/stats', authenticate, requireOwner, async (req: AuthRequest, res: Response) => {
    try {
        // Count all tenants (excluding owner)
        const totalTenants = await prisma.tenant.count({
            where: { isOwner: false }
        });

        // Count all projects
        const totalProjects = await prisma.project.count();

        // Count all spins
        const totalSpins = await prisma.spinHistory.count();

        // Count active projects
        const activeProjects = await prisma.project.count({
            where: { status: 'Active' }
        });

        // Get recent signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSignups = await prisma.tenant.count({
            where: {
                isOwner: false,
                createdAt: { gte: thirtyDaysAgo }
            }
        });

        // Get signups by day for chart
        const recentTenants = await prisma.tenant.findMany({
            where: {
                isOwner: false,
                createdAt: { gte: thirtyDaysAgo }
            },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' }
        });

        const dailySignups: { [key: string]: number } = {};
        recentTenants.forEach(t => {
            const day = t.createdAt.toISOString().split('T')[0];
            dailySignups[day] = (dailySignups[day] || 0) + 1;
        });

        const chartData = Object.entries(dailySignups).map(([date, count]) => ({
            date,
            signups: count
        }));

        res.json({
            totalTenants,
            totalProjects,
            totalSpins,
            activeProjects,
            recentSignups,
            chartData
        });
    } catch (error) {
        console.error('Get owner stats error:', error);
        res.status(500).json({ error: 'Failed to fetch owner stats' });
    }
});

// GET /api/owner/tenant/:id - Get specific tenant details (owner only)
router.get('/tenant/:id', authenticate, requireOwner, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const tenant = await prisma.tenant.findUnique({
            where: { id },
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        currentSpins: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: {
                        spinHistory: true,
                        prizes: true
                    }
                }
            }
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const { password: _, ...tenantWithoutPassword } = tenant;
        res.json(tenantWithoutPassword);
    } catch (error) {
        console.error('Get tenant details error:', error);
        res.status(500).json({ error: 'Failed to fetch tenant details' });
    }
});

export default router;
