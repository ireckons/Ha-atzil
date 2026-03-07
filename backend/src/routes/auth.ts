import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { z } from 'zod';
import { getEntity, redis } from '../db/client';
import { config } from '../config';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();
const googleClient = new OAuth2Client(config.googleClientId);

const GoogleLoginSchema = z.object({
    credential: z.string(),
});

type User = { id: string; email: string; password_hash: string; name: string; is_admin: boolean };

// POST /api/auth/google
router.post('/google', authLimiter, validate(GoogleLoginSchema), async (req: Request, res: Response) => {
    const { credential } = req.body as z.infer<typeof GoogleLoginSchema>;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: config.googleClientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(401).json({ error: 'Invalid Google token' });
            return;
        }

        const email = payload.email.toLowerCase();

        // Security check: is this email allowed to be an admin?
        if (!config.adminEmails.includes(email)) {
            console.warn(`[Auth] Unauthorized Google login attempt by: ${email}`);
            res.status(403).json({ error: 'Not authorized for admin access' });
            return;
        }

        // Check if user exists in DB
        let userId = await redis.hget('users:emails', email);

        // If they don't exist yet, we could auto-create them, or let it pass with a virtual ID
        // For simplicity, we'll assign a deterministic virtual ID based on their email
        if (!userId) {
            userId = `google-admin-${email}`;
        }

        const token = jwt.sign(
            { userId, isAdmin: true },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
        );
        res.json({ token, isAdmin: true, name: payload.name, picture: payload.picture });
    } catch (err) {
        console.error('[Auth] Google verify error:', err);
        res.status(401).json({ error: 'Token verification failed' });
    }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response) => {
    try {
        const user = await getEntity<User>('user', req.userId as string);
        if (!user) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ id: user.id, email: user.email, is_admin: user.is_admin });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/logout (stateless JWT – just acknowledge)
router.post('/logout', (_, res: Response) => {
    res.json({ message: 'Logged out' });
});

export default router;
