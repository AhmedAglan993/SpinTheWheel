import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/projects - List all projects for tenant
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: { tenantId: req.tenant!.tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                spinConfig: true,
                _count: {
                    select: { prizes: true, spinHistory: true }
                }
            }
        });
        res.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// POST /api/projects - Create a new project
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { name, startDate, endDate, spinLimit, price } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const project = await prisma.project.create({
            data: {
                tenantId: req.tenant!.tenantId,
                name,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                spinLimit: spinLimit ? parseInt(spinLimit) : undefined,
                price: price ? parseFloat(price) : undefined,
                status: 'Draft'
            }
        });

        res.status(201).json(project);
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// GET /api/projects/:id - Get project details
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findFirst({
            where: {
                id,
                tenantId: req.tenant!.tenantId
            },
            include: {
                spinConfig: true,
                prizes: true,
                _count: {
                    select: { spinHistory: true }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, startDate, endDate, spinLimit, status, price, isPaid } = req.body;

        const project = await prisma.project.findFirst({
            where: { id, tenantId: req.tenant!.tenantId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                name,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                spinLimit: spinLimit !== undefined ? parseInt(spinLimit) : undefined,
                price: price !== undefined ? parseFloat(price) : undefined,
                status,
                isPaid: isPaid !== undefined ? isPaid : undefined
            }
        });

        res.json(updatedProject);
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findFirst({
            where: { id, tenantId: req.tenant!.tenantId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await prisma.project.delete({
            where: { id }
        });

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
