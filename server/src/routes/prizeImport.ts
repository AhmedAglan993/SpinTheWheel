import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper: Create a history snapshot
async function createSnapshot(
    tenantId: string,
    action: string,
    projectId?: string | null,
    description?: string
) {
    const prizes = await prisma.prize.findMany({
        where: {
            tenantId,
            ...(projectId ? { projectId } : {})
        },
        select: {
            name: true,
            type: true,
            description: true,
            status: true,
            isUnlimited: true,
            quantity: true,
            initialQuantity: true,
            exhaustionBehavior: true
        }
    });

    await prisma.prizeHistorySnapshot.create({
        data: {
            tenantId,
            projectId: projectId || null,
            prizes: prizes,
            action,
            description
        }
    });
}

// ============ CSV/Excel Import ============

// POST /api/prizes/import - Import prizes from parsed data
router.post('/import', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { prizes, projectId } = req.body;

        if (!Array.isArray(prizes) || prizes.length === 0) {
            return res.status(400).json({ error: 'No prizes provided' });
        }

        // Create snapshot before import
        await createSnapshot(
            req.tenant!.tenantId,
            'imported',
            projectId,
            `Imported ${prizes.length} prizes`
        );

        // Import prizes
        const createdPrizes = await Promise.all(
            prizes.map((prize: any) =>
                prisma.prize.create({
                    data: {
                        tenantId: req.tenant!.tenantId,
                        projectId: projectId || null,
                        name: prize.name || 'Unnamed Prize',
                        type: prize.type || 'Voucher',
                        description: prize.description || '',
                        status: prize.status || 'Active',
                        isUnlimited: prize.isUnlimited ?? true,
                        quantity: prize.isUnlimited ? null : (prize.quantity || null),
                        initialQuantity: prize.isUnlimited ? null : (prize.quantity || null),
                        exhaustionBehavior: prize.exhaustionBehavior || 'exclude'
                    }
                })
            )
        );

        res.status(201).json({
            message: `Successfully imported ${createdPrizes.length} prizes`,
            prizes: createdPrizes
        });
    } catch (error: any) {
        console.error('Import prizes error:', error);

        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: 'A prize with that name already exists in this tenant'
            });
        }

        res.status(500).json({ error: 'Failed to import prizes' });
    }
});

// ============ Templates ============

// GET /api/prizes/templates - Get all templates for tenant
router.get('/templates', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const templates = await prisma.prizeTemplate.findMany({
            where: { tenantId: req.tenant!.tenantId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(templates);
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// POST /api/prizes/templates - Create new template from current prizes
router.post('/templates', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, projectId } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Template name is required' });
        }

        // Get current prizes
        const whereClause: any = { tenantId: req.tenant!.tenantId };
        if (projectId) {
            whereClause.projectId = projectId;
        }

        const prizes = await prisma.prize.findMany({
            where: whereClause,
            select: {
                name: true,
                type: true,
                description: true,
                status: true,
                isUnlimited: true,
                quantity: true,
                initialQuantity: true,
                exhaustionBehavior: true
            }
        });

        if (prizes.length === 0) {
            return res.status(400).json({ error: 'No prizes to save as template' });
        }

        const template = await prisma.prizeTemplate.create({
            data: {
                tenantId: req.tenant!.tenantId,
                name,
                description,
                prizes: prizes
            }
        });

        res.status(201).json(template);
    } catch (error: any) {
        console.error('Create template error:', error);

        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A template with that name already exists' });
        }

        res.status(500).json({ error: 'Failed to create template' });
    }
});

// DELETE /api/prizes/templates/:id - Delete a template
router.delete('/templates/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify template belongs to tenant
        const template = await prisma.prizeTemplate.findFirst({
            where: { id, tenantId: req.tenant!.tenantId }
        });

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        await prisma.prizeTemplate.delete({ where: { id } });

        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Delete template error:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

// POST /api/prizes/templates/:id/apply - Apply template to project
router.post('/templates/:id/apply', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { projectId, clearExisting = false } = req.body;

        // Get template
        const template = await prisma.prizeTemplate.findFirst({
            where: { id, tenantId: req.tenant!.tenantId }
        });

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        // Create snapshot before applying
        await createSnapshot(
            req.tenant!.tenantId,
            'imported',
            projectId,
            `Applied template: ${template.name}`
        );

        // Optionally clear existing prizes
        if (clearExisting) {
            await prisma.prize.deleteMany({
                where: {
                    tenantId: req.tenant!.tenantId,
                    ...(projectId ? { projectId } : { projectId: null })
                }
            });
        }

        // Create prizes from template
        const templatePrizes = template.prizes as any[];
        const createdPrizes = await Promise.all(
            templatePrizes.map((prize: any) =>
                prisma.prize.create({
                    data: {
                        tenantId: req.tenant!.tenantId,
                        projectId: projectId || null,
                        name: prize.name,
                        type: prize.type,
                        description: prize.description || '',
                        status: prize.status || 'Active',
                        isUnlimited: prize.isUnlimited ?? true,
                        quantity: prize.isUnlimited ? null : prize.quantity,
                        initialQuantity: prize.isUnlimited ? null : prize.initialQuantity,
                        exhaustionBehavior: prize.exhaustionBehavior || 'exclude'
                    }
                })
            )
        );

        res.status(201).json({
            message: `Applied ${createdPrizes.length} prizes from template`,
            prizes: createdPrizes
        });
    } catch (error: any) {
        console.error('Apply template error:', error);

        if (error.code === 'P2002') {
            return res.status(400).json({
                error: 'Some prize names conflict with existing prizes'
            });
        }

        res.status(500).json({ error: 'Failed to apply template' });
    }
});

// ============ History Snapshots ============

// GET /api/prizes/history - Get prize history snapshots
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.query;

        const whereClause: any = { tenantId: req.tenant!.tenantId };
        if (projectId) {
            whereClause.projectId = String(projectId);
        }

        const snapshots = await prisma.prizeHistorySnapshot.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50 snapshots
        });

        res.json(snapshots);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// POST /api/prizes/history/:id/restore - Restore prizes from snapshot
router.post('/history/:id/restore', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { projectId } = req.body;

        // Get snapshot
        const snapshot = await prisma.prizeHistorySnapshot.findFirst({
            where: { id, tenantId: req.tenant!.tenantId }
        });

        if (!snapshot) {
            return res.status(404).json({ error: 'Snapshot not found' });
        }

        // Create snapshot before restoring (to preserve current state)
        await createSnapshot(
            req.tenant!.tenantId,
            'modified',
            projectId || snapshot.projectId,
            'Before restore'
        );

        // Delete current prizes for the project/tenant
        await prisma.prize.deleteMany({
            where: {
                tenantId: req.tenant!.tenantId,
                ...(snapshot.projectId ? { projectId: snapshot.projectId } : { projectId: null })
            }
        });

        // Restore prizes from snapshot
        const snapshotPrizes = snapshot.prizes as any[];
        const restoredPrizes = await Promise.all(
            snapshotPrizes.map((prize: any) =>
                prisma.prize.create({
                    data: {
                        tenantId: req.tenant!.tenantId,
                        projectId: snapshot.projectId || null,
                        name: prize.name,
                        type: prize.type,
                        description: prize.description || '',
                        status: prize.status || 'Active',
                        isUnlimited: prize.isUnlimited ?? true,
                        quantity: prize.isUnlimited ? null : prize.quantity,
                        initialQuantity: prize.isUnlimited ? null : prize.initialQuantity,
                        exhaustionBehavior: prize.exhaustionBehavior || 'exclude'
                    }
                })
            )
        );

        res.json({
            message: `Restored ${restoredPrizes.length} prizes from snapshot`,
            prizes: restoredPrizes
        });
    } catch (error) {
        console.error('Restore from history error:', error);
        res.status(500).json({ error: 'Failed to restore from history' });
    }
});

export default router;
