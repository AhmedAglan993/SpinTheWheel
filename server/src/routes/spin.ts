import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/spin/config/:tenantId - Get public spin configuration
router.get('/config/:tenantId', async (req, res: Response) => {
    try {
        const { tenantId } = req.params;

        // Get tenant info
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId }
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        // Get spin configuration
        let config = await prisma.spinConfiguration.findUnique({
            where: { tenantId }
        });

        // If no config exists, create default
        if (!config) {
            config = await prisma.spinConfiguration.create({
                data: {
                    tenantId,
                    wheelColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
                    spinDuration: 5000,
                    soundEnabled: true,
                    showConfetti: true
                }
            });
        }

        // Get active prizes
        const prizes = await prisma.prize.findMany({
            where: {
                tenantId,
                status: 'Active'
            }
        });

        res.json({
            tenant: {
                name: tenant.name,
                logo: tenant.logo,
                primaryColor: tenant.primaryColor
            },
            config,
            prizes
        });
    } catch (error) {
        console.error('Get spin config error:', error);
        res.status(500).json({ error: 'Failed to fetch spin configuration' });
    }
});

// PUT /api/spin/config - Update spin configuration (authenticated)
router.put('/config', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { wheelColors, spinDuration, soundEnabled, showConfetti, customMessage } = req.body;

        const config = await prisma.spinConfiguration.upsert({
            where: { tenantId: req.tenant!.tenantId },
            update: {
                wheelColors,
                spinDuration,
                soundEnabled,
                showConfetti,
                customMessage
            },
            create: {
                tenantId: req.tenant!.tenantId,
                wheelColors: wheelColors || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
                spinDuration: spinDuration || 5000,
                soundEnabled: soundEnabled !== undefined ? soundEnabled : true,
                showConfetti: showConfetti !== undefined ? showConfetti : true,
                customMessage
            }
        });

        res.json(config);
    } catch (error) {
        console.error('Update spin config error:', error);
        res.status(500).json({ error: 'Failed to update spin configuration' });
    }
});

// POST /api/spin/record - Record a spin result
router.post('/record', async (req, res: Response) => {
    try {
        const { tenantId, userName, userEmail, prizeWon } = req.body;

        if (!tenantId || !prizeWon) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const record = await prisma.spinHistory.create({
            data: {
                tenantId,
                userName,
                userEmail,
                prizeWon
            }
        });

        res.status(201).json(record);
    } catch (error) {
        console.error('Record spin error:', error);
        res.status(500).json({ error: 'Failed to record spin' });
    }
});

// GET /api/spin/history - Get spin history for tenant (authenticated)
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const history = await prisma.spinHistory.findMany({
            where: { tenantId: req.tenant!.tenantId },
            orderBy: { timestamp: 'desc' },
            take: 100 // Limit to last 100 spins
        });

        res.json(history);
    } catch (error) {
        console.error('Get spin history error:', error);
        res.status(500).json({ error: 'Failed to fetch spin history' });
    }
});

export default router;
