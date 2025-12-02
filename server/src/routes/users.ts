import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users - Get all users for current tenant
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { tenantId: req.tenant!.tenantId },
            orderBy: { dateJoined: 'desc' }
        });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST /api/users - Add new user
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, avatar, plan = 'Basic', status = 'Active' } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email required' });
        }

        const user = await prisma.user.create({
            data: {
                tenantId: req.tenant!.tenantId,
                name,
                email,
                avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
                plan,
                status
            }
        });

        res.status(201).json(user);
    } catch (error: any) {
        console.error('Create user error:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify user belongs to tenant
        const existingUser = await prisma.user.findFirst({
            where: {
                id,
                tenantId: req.tenant!.tenantId
            }
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
