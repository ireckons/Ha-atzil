import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
    userId?: string;
    isAdmin?: boolean;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid Authorization header' });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; isAdmin: boolean };
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
    if (!req.isAdmin) {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
}
