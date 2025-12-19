import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/stats/overview - Get overall stats for tenant
router.get('/overview', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const tenantId = req.tenant!.tenantId;

        // Get total spins
        const totalSpins = await prisma.spinHistory.count({
            where: { tenantId }
        });

        // Get unique users (by email or phone)
        const uniqueUsers = await prisma.spinHistory.groupBy({
            by: ['userEmail'],
            where: {
                tenantId,
                userEmail: { not: null }
            }
        });

        // Get spins by prize
        const prizesWon = await prisma.spinHistory.groupBy({
            by: ['prizeWon'],
            where: { tenantId },
            _count: { prizeWon: true }
        });

        // Get spins over last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSpins = await prisma.spinHistory.findMany({
            where: {
                tenantId,
                timestamp: { gte: thirtyDaysAgo }
            },
            select: { timestamp: true },
            orderBy: { timestamp: 'asc' }
        });

        // Group by day for chart
        const dailySpins: { [key: string]: number } = {};
        recentSpins.forEach(spin => {
            const day = spin.timestamp.toISOString().split('T')[0];
            dailySpins[day] = (dailySpins[day] || 0) + 1;
        });

        const chartData = Object.entries(dailySpins).map(([date, count]) => ({
            date,
            spins: count
        }));

        // Get total projects
        const totalProjects = await prisma.project.count({
            where: { tenantId }
        });

        // Get active projects
        const activeProjects = await prisma.project.count({
            where: { tenantId, status: 'Active' }
        });

        res.json({
            totalSpins,
            uniqueUsers: uniqueUsers.length,
            prizesWon,
            chartData,
            totalProjects,
            activeProjects
        });
    } catch (error) {
        console.error('Get stats overview error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /api/stats/project/:id - Get stats for specific project
router.get('/project/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenant!.tenantId;

        // Verify project belongs to tenant
        const project = await prisma.project.findFirst({
            where: { id, tenantId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Get project spins
        const totalSpins = await prisma.spinHistory.count({
            where: { projectId: id }
        });

        // Get unique users for project
        const uniqueUsers = await prisma.spinHistory.groupBy({
            by: ['userEmail'],
            where: {
                projectId: id,
                userEmail: { not: null }
            }
        });

        // Get prizes won in project
        const prizesWon = await prisma.spinHistory.groupBy({
            by: ['prizeWon'],
            where: { projectId: id },
            _count: { prizeWon: true }
        });

        // Get recent spins for chart
        const recentSpins = await prisma.spinHistory.findMany({
            where: { projectId: id },
            select: { timestamp: true },
            orderBy: { timestamp: 'asc' }
        });

        // Group by day
        const dailySpins: { [key: string]: number } = {};
        recentSpins.forEach(spin => {
            const day = spin.timestamp.toISOString().split('T')[0];
            dailySpins[day] = (dailySpins[day] || 0) + 1;
        });

        const chartData = Object.entries(dailySpins).map(([date, count]) => ({
            date,
            spins: count
        }));

        // Get leads with contact info
        const leads = await prisma.spinHistory.findMany({
            where: {
                projectId: id,
                OR: [
                    { userEmail: { not: null } },
                    { userPhone: { not: null } }
                ]
            },
            select: {
                userName: true,
                userEmail: true,
                userPhone: true,
                prizeWon: true,
                timestamp: true
            },
            orderBy: { timestamp: 'desc' },
            take: 50
        });

        res.json({
            project,
            totalSpins,
            uniqueUsers: uniqueUsers.length,
            prizesWon,
            chartData,
            leads,
            spinLimit: project.spinLimit,
            currentSpins: project.currentSpins
        });
    } catch (error) {
        console.error('Get project stats error:', error);
        res.status(500).json({ error: 'Failed to fetch project stats' });
    }
});

export default router;
