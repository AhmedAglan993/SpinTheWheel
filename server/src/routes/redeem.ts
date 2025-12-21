import { Router, Response, Request } from 'express';
import prisma from '../db/prisma';

const router = Router();

// GET /api/redeem/:token - Get prize info for redemption (public)
router.get('/:token', async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const spinRecord = await prisma.spinHistory.findUnique({
            where: { redemptionToken: token },
            include: {
                tenant: {
                    select: {
                        name: true,
                        logo: true,
                        primaryColor: true,
                        backgroundColor: true,
                        textColor: true
                    }
                },
                project: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!spinRecord) {
            return res.status(404).json({ error: 'Invalid redemption code' });
        }

        if (spinRecord.isRedeemed) {
            return res.status(400).json({
                error: 'This prize has already been redeemed',
                alreadyRedeemed: true,
                redeemedAt: spinRecord.redeemedAt
            });
        }

        res.json({
            prizeWon: spinRecord.prizeWon,
            tenant: spinRecord.tenant,
            projectName: spinRecord.project?.name,
            timestamp: spinRecord.timestamp,
            isRedeemed: spinRecord.isRedeemed
        });
    } catch (error) {
        console.error('Get redemption info error:', error);
        res.status(500).json({ error: 'Failed to get redemption info' });
    }
});

// POST /api/redeem/:token - Redeem prize with contact info (public)
router.post('/:token', async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { email, phone } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ error: 'Email or phone is required' });
        }

        const spinRecord = await prisma.spinHistory.findUnique({
            where: { redemptionToken: token },
            include: {
                tenant: {
                    select: {
                        name: true,
                        logo: true,
                        primaryColor: true
                    }
                }
            }
        });

        if (!spinRecord) {
            return res.status(404).json({ error: 'Invalid redemption code' });
        }

        if (spinRecord.isRedeemed) {
            return res.status(400).json({
                error: 'This prize has already been redeemed',
                alreadyRedeemed: true
            });
        }

        // Update spin record with contact info and mark as redeemed
        const updatedRecord = await prisma.spinHistory.update({
            where: { redemptionToken: token },
            data: {
                userEmail: email || undefined,
                userPhone: phone || undefined,
                isRedeemed: true,
                redeemedAt: new Date()
            },
            include: {
                tenant: {
                    select: {
                        name: true,
                        logo: true,
                        primaryColor: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Prize redeemed successfully!',
            prizeWon: updatedRecord.prizeWon,
            tenant: updatedRecord.tenant
        });
    } catch (error) {
        console.error('Redeem prize error:', error);
        res.status(500).json({ error: 'Failed to redeem prize' });
    }
});

export default router;
