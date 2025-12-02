import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

// Extend Express Request type to include tenant info
export interface AuthRequest extends Request {
    tenant?: JWTPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = verifyToken(token);

        // Attach tenant info to request
        req.tenant = payload;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Optional authentication - doesn't fail if no token
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyToken(token);
            req.tenant = payload;
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
}
