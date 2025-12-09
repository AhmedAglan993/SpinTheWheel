import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/spin/config/:id - Get public spin configuration (tenantId or projectId)
router.get('/config/:id', async (req, res: Response) => {
    try {
        const { id } = req.params;

        // FIRST: Try to find a Project
        const project = await prisma.project.findUnique({
            where: { id },
            include: { spinConfig: true, tenant: true }
        });

        if (project) {
            // ===== PROJECT MODE =====
            // Validate project is active
            if (project.status !== 'Active') {
                return res.status(403).json({ error: 'This event is not currently active.' });
            }

            // Validate dates
            const now = new Date();
            if (project.startDate && now < project.startDate) {
                return res.status(403).json({ error: 'This event has not started yet.' });
            }
            if (project.endDate && now > project.endDate) {
                return res.status(403).json({ error: 'This event has ended.' });
            }

            // Validate spin limit
            if (project.spinLimit && project.currentSpins >= project.spinLimit) {
                return res.status(403).json({ error: 'This event has reached its spin limit.' });
            }


            // Get project prizes (project-specific OR tenant-level)
            const prizes = await prisma.prize.findMany({
                where: {
                    tenantId: project.tenantId,
                    OR: [
                        { projectId: project.id },
                        { projectId: null }
                    ],
                    status: 'Active'
                }
            });

            // Filter and annotate prizes based on availability
            const availablePrizes = prizes
                .filter(prize => {
                    // Always include unlimited prizes
                    if (prize.isUnlimited) return true;

                    // Include numbered prizes with quantity > 0
                    if (prize.quantity && prize.quantity > 0) return true;

                    // Include exhausted prizes if set to show_unavailable
                    if (prize.quantity === 0 && prize.exhaustionBehavior === 'show_unavailable') return true;

                    // Exclude all other cases (exhausted with exclude or mark_inactive)
                    return false;
                })
                .map(prize => ({
                    ...prize,
                    isAvailable: prize.isUnlimited || (prize.quantity !== null && prize.quantity > 0)
                }));

            return res.json({
                tenant: {
                    name: project.tenant.name,
                    logo: project.tenant.logo,
                    primaryColor: project.tenant.primaryColor,
                    secondaryColor: project.tenant.secondaryColor,
                    backgroundColor: project.tenant.backgroundColor,
                    textColor: project.tenant.textColor
                },
                config: project.spinConfig,
                prizes: availablePrizes,
                projectId: project.id
            });
        }

        // SECOND: Fallback to Tenant (Legacy Mode)
        const tenant = await prisma.tenant.findUnique({
            where: { id }
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Get default tenant config (where projectId is null)
        let config = await prisma.spinConfiguration.findFirst({
            where: { tenantId: id, projectId: null }
        });

        if (!config) {
            config = await prisma.spinConfiguration.create({
                data: {
                    tenantId: id,
                    projectId: null,
                    wheelColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
                    spinDuration: 5000,
                    soundEnabled: true,
                    showConfetti: true
                }
            });
        }

        // Get default tenant prizes (where projectId is null)
        const prizes = await prisma.prize.findMany({
            where: {
                tenantId: id,
                projectId: null,
                status: 'Active'
            }
        });

        // Filter and annotate prizes based on availability
        const availablePrizes = prizes
            .filter(prize => {
                // Always include unlimited prizes
                if (prize.isUnlimited) return true;

                // Include numbered prizes with quantity > 0
                if (prize.quantity && prize.quantity > 0) return true;

                // Include exhausted prizes if set to show_unavailable
                if (prize.quantity === 0 && prize.exhaustionBehavior === 'show_unavailable') return true;

                // Exclude all other cases
                return false;
            })
            .map(prize => ({
                ...prize,
                isAvailable: prize.isUnlimited || (prize.quantity !== null && prize.quantity > 0)
            }));

        res.json({
            tenant: {
                name: tenant.name,
                logo: tenant.logo,
                primaryColor: tenant.primaryColor,
                secondaryColor: tenant.secondaryColor,
                backgroundColor: tenant.backgroundColor,
                textColor: tenant.textColor
            },
            config,
            prizes: availablePrizes
        });
    } catch (error) {
        console.error('Get spin config error:', error);
        res.status(500).json({ error: 'Failed to fetch spin configuration' });
    }
});

// PUT /api/spin/config - Update spin configuration (authenticated)
router.put('/config', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { projectId, wheelColors, spinDuration, soundEnabled, showConfetti, customMessage } = req.body;

        let config;

        if (projectId) {
            // Update project-specific config
            const project = await prisma.project.findFirst({
                where: { id: projectId, tenantId: req.tenant!.tenantId }
            });

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            config = await prisma.spinConfiguration.upsert({
                where: { projectId },
                update: {
                    wheelColors,
                    spinDuration,
                    soundEnabled,
                    showConfetti,
                    customMessage
                },
                create: {
                    tenantId: req.tenant!.tenantId,
                    projectId,
                    wheelColors: wheelColors || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
                    spinDuration: spinDuration || 5000,
                    soundEnabled: soundEnabled !== undefined ? soundEnabled : true,
                    showConfetti: showConfetti !== undefined ? showConfetti : true,
                    customMessage
                }
            });
        } else {
            // Update default tenant config (projectId = null)
            const existingConfig = await prisma.spinConfiguration.findFirst({
                where: { tenantId: req.tenant!.tenantId, projectId: null }
            });

            if (existingConfig) {
                config = await prisma.spinConfiguration.update({
                    where: { id: existingConfig.id },
                    data: {
                        wheelColors,
                        spinDuration,
                        soundEnabled,
                        showConfetti,
                        customMessage
                    }
                });
            } else {
                config = await prisma.spinConfiguration.create({
                    data: {
                        tenantId: req.tenant!.tenantId,
                        projectId: null,
                        wheelColors: wheelColors || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
                        spinDuration: spinDuration || 5000,
                        soundEnabled: soundEnabled !== undefined ? soundEnabled : true,
                        showConfetti: showConfetti !== undefined ? showConfetti : true,
                        customMessage
                    }
                });
            }
        }

        res.json(config);
    } catch (error) {
        console.error('Update spin config error:', error);
        res.status(500).json({ error: 'Failed to update spin configuration' });
    }
});

// POST /api/spin/record - Record a spin result
router.post('/record', async (req, res: Response) => {
    try {
        const { tenantId, projectId, userName, userEmail, prizeWon } = req.body;

        if (!tenantId || !prizeWon) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the prize that was won to check if it's numbered
        const wonPrize = await prisma.prize.findFirst({
            where: {
                tenantId,
                name: prizeWon,
                OR: [
                    { projectId: projectId || null },
                    { projectId: null }
                ]
            }
        });

        // Increment project spin count if projectId is provided
        if (projectId) {
            await prisma.project.update({
                where: { id: projectId },
                data: { currentSpins: { increment: 1 } }
            });
        }

        // Record the spin
        const record = await prisma.spinHistory.create({
            data: {
                tenantId,
                projectId,
                userName,
                userEmail,
                prizeWon
            }
        });

        // Handle numbered prize quantity decrement
        if (wonPrize && !wonPrize.isUnlimited && wonPrize.quantity !== null && wonPrize.quantity > 0) {
            const updatedPrize = await prisma.prize.update({
                where: { id: wonPrize.id },
                data: { quantity: { decrement: 1 } }
            });

            // Check if prize is now exhausted and should be marked inactive
            if (updatedPrize.quantity === 0 && updatedPrize.exhaustionBehavior === 'mark_inactive') {
                await prisma.prize.update({
                    where: { id: wonPrize.id },
                    data: { status: 'Inactive' }
                });
            }
        }

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
