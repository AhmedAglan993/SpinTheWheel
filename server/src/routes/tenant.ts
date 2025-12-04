import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/tenant - Get tenant settings
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
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
        res.status(500).json({ error: 'Failed to fetch tenant settings' });
    }
});

// PUT /api/tenant - Update tenant settings
router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { name, ownerName, logo, primaryColor, secondaryColor, backgroundColor, textColor } = req.body;

        const tenant = await prisma.tenant.update({
            where: { id: req.tenant!.tenantId },
            data: {
                name,
                ownerName,
                logo,
                primaryColor,
                secondaryColor,
                backgroundColor,
                textColor
            }
        });

        const { password: _, ...tenantWithoutPassword } = tenant;
        res.json(tenantWithoutPassword);
    } catch (error) {
        console.error('Update tenant error:', error);
        res.status(500).json({ error: 'Failed to update tenant settings' });
    }
});

export default router;
