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

        // Count unique users (by email)
        const uniqueEmails = await prisma.spinHistory.groupBy({
            by: ['userEmail'],
            where: { userEmail: { not: null } }
        });
        const uniqueUsers = uniqueEmails.length;

        // Get recent signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSignups = await prisma.tenant.count({
            where: {
                isOwner: false,
                createdAt: { gte: thirtyDaysAgo }
            }
        });

        // Get spins by day for chart (last 30 days)
        const recentSpins = await prisma.spinHistory.findMany({
            where: { timestamp: { gte: thirtyDaysAgo } },
            select: { timestamp: true },
            orderBy: { timestamp: 'asc' }
        });

        const dailySpins: { [key: string]: number } = {};
        recentSpins.forEach(s => {
            const day = s.timestamp.toISOString().split('T')[0];
            dailySpins[day] = (dailySpins[day] || 0) + 1;
        });

        const chartData = Object.entries(dailySpins).map(([date, count]) => ({
            date,
            spins: count
        }));

        // Get prizes won breakdown
        const prizesWon = await prisma.spinHistory.groupBy({
            by: ['prizeWon'],
            _count: { prizeWon: true },
            orderBy: { _count: { prizeWon: 'desc' } },
            take: 10
        });

        res.json({
            totalTenants,
            totalProjects,
            totalSpins,
            activeProjects,
            uniqueUsers,
            recentSignups,
            chartData,
            prizesWon
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

// GET /api/owner/projects - Get all projects from all tenants (owner only)
router.get('/projects', authenticate, requireOwner, async (req: AuthRequest, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        prizes: true,
                        spinHistory: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(projects);
    } catch (error) {
        console.error('Get all projects error:', error);
        res.status(500).json({ error: 'Failed to fetch all projects' });
    }
});

// GET /api/owner/prizes - Get all prizes from all tenants (owner only)
router.get('/prizes', authenticate, requireOwner, async (req: AuthRequest, res: Response) => {
    try {
        const prizes = await prisma.prize.findMany({
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(prizes);
    } catch (error) {
        console.error('Get all prizes error:', error);
        res.status(500).json({ error: 'Failed to fetch all prizes' });
    }
});

// GET /api/owner/leads - Get all leads (spin history) from all tenants (owner only)
router.get('/leads', authenticate, requireOwner, async (req: AuthRequest, res: Response) => {
    try {
        const leads = await prisma.spinHistory.findMany({
            where: {
                OR: [
                    { userName: { not: null } },
                    { userEmail: { not: null } },
                    { userPhone: { not: null } }
                ]
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { timestamp: 'desc' },
            take: 1000 // Limit to last 1000 leads for performance
        });

        res.json(leads);
    } catch (error) {
        console.error('Get all leads error:', error);
        res.status(500).json({ error: 'Failed to fetch all leads' });
    }
});

export default router;

