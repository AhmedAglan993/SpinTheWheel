import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/contact - Submit new contact request (public or authenticated)
router.post('/', async (req, res: Response) => {
    try {
        const { name, email, phone, message, requestType } = req.body;

        // Validate input
        if (!name || !email || !message || !requestType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create contact request
        const contactRequest = await prisma.contactRequest.create({
            data: {
                name,
                email,
                phone,
                message,
                requestType,
                status: 'Pending'
            }
        });

        res.status(201).json(contactRequest);
    } catch (error) {
        console.error('Create contact request error:', error);
        res.status(500).json({ error: 'Failed to submit contact request' });
    }
});

// GET /api/contact - Get all contact requests (admin only)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const contactRequests = await prisma.contactRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.json(contactRequests);
    } catch (error) {
        console.error('Get contact requests error:', error);
        res.status(500).json({ error: 'Failed to fetch contact requests' });
    }
});

// PATCH /api/contact/:id - Update contact request (admin only)
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, estimatedCost, estimatedTimeframe, adminNotes } = req.body;

        const contactRequest = await prisma.contactRequest.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(estimatedCost !== undefined && { estimatedCost }),
                ...(estimatedTimeframe && { estimatedTimeframe }),
                ...(adminNotes !== undefined && { adminNotes })
            }
        });

        res.json(contactRequest);
    } catch (error) {
        console.error('Update contact request error:', error);
        res.status(500).json({ error: 'Failed to update contact request' });
    }
});

// DELETE /api/contact/:id - Delete contact request (admin only)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.contactRequest.delete({
            where: { id }
        });

        res.json({ message: 'Contact request deleted successfully' });
    } catch (error) {
        console.error('Delete contact request error:', error);
        res.status(500).json({ error: 'Failed to delete contact request' });
    }
});

export default router;
