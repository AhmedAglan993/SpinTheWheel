import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/prizes - Get all prizes for current tenant (optionally filtered by project)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.query;

        const whereClause: any = { tenantId: req.tenant!.tenantId };

        // Only filter by projectId if explicitly provided
        if (projectId && projectId !== 'all') {
            whereClause.projectId = String(projectId);
        }
        // If no filter, show all prizes for the tenant

        const prizes = await prisma.prize.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        res.json(prizes);
    } catch (error) {
        console.error('Get prizes error:', error);
        res.status(500).json({ error: 'Failed to fetch prizes' });
    }
});

// POST /api/prizes - Create new prize
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const {
            name,
            type,
            description,
            status = 'Active',
            projectId,
            isUnlimited = true,
            quantity,
            exhaustionBehavior = 'exclude'
        } = req.body;

        if (!name || !type || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate quantity for numbered prizes
        if (!isUnlimited) {
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ error: 'Quantity must be greater than 0 for numbered prizes' });
            }
        }

        // Verify project belongs to tenant if provided
        if (projectId) {
            const project = await prisma.project.findFirst({
                where: { id: projectId, tenantId: req.tenant!.tenantId }
            });

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
        }

        const prize = await prisma.prize.create({
            data: {
                tenantId: req.tenant!.tenantId,
                projectId: projectId || null,
                name,
                type,
                description,
                status,
                isUnlimited,
                quantity: isUnlimited ? null : quantity,
                initialQuantity: isUnlimited ? null : quantity,
                exhaustionBehavior
            }
        });

        res.status(201).json(prize);
    } catch (error) {
        console.error('Create prize error:', error);
        res.status(500).json({ error: 'Failed to create prize' });
    }
});

// PUT /api/prizes/:id - Update prize
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, type, description, status, isUnlimited, quantity, exhaustionBehavior } = req.body;

        // Verify prize belongs to tenant
        const existingPrize = await prisma.prize.findFirst({
            where: {
                id,
                tenantId: req.tenant!.tenantId
            }
        });

        if (!existingPrize) {
            return res.status(404).json({ error: 'Prize not found' });
        }

        // Validate quantity for numbered prizes
        if (isUnlimited === false) {
            if (quantity === undefined || quantity < 0) {
                return res.status(400).json({ error: 'Quantity must be 0 or greater for numbered prizes' });
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (type !== undefined) updateData.type = type;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (exhaustionBehavior !== undefined) updateData.exhaustionBehavior = exhaustionBehavior;

        if (isUnlimited !== undefined) {
            updateData.isUnlimited = isUnlimited;
            if (isUnlimited) {
                updateData.quantity = null;
                updateData.initialQuantity = null;
            }
        }

        if (quantity !== undefined && !updateData.isUnlimited) {
            updateData.quantity = quantity;
            // Update initialQuantity if new quantity is higher
            if (existingPrize.initialQuantity === null || quantity > existingPrize.initialQuantity) {
                updateData.initialQuantity = quantity;
            }
        }

        const prize = await prisma.prize.update({
            where: { id },
            data: updateData
        });

        res.json(prize);
    } catch (error) {
        console.error('Update prize error:', error);
        res.status(500).json({ error: 'Failed to update prize' });
    }
});

// DELETE /api/prizes/:id - Delete prize
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify prize belongs to tenant
        const existingPrize = await prisma.prize.findFirst({
            where: {
                id,
                tenantId: req.tenant!.tenantId
            }
        });

        if (!existingPrize) {
            return res.status(404).json({ error: 'Prize not found' });
        }

        await prisma.prize.delete({
            where: { id }
        });

        res.json({ message: 'Prize deleted successfully' });
    } catch (error) {
        console.error('Delete prize error:', error);
        res.status(500).json({ error: 'Failed to delete prize' });
    }
});

export default router;
