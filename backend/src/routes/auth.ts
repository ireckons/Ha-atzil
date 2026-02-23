import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../db/client';
import { config } from '../config';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

// POST /api/auth/login
router.post('/login', authLimiter, validate(LoginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body as z.infer<typeof LoginSchema>;
    try {
        const result = await query<{ id: string; password_hash: string; is_admin: boolean }>(
            'SELECT id, password_hash, is_admin FROM users WHERE email = $1',
            [email]
        );
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign(
            { userId: user.id, isAdmin: user.is_admin },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
        );
        res.json({ token, isAdmin: user.is_admin });
    } catch (err) {
        console.error('[Auth] Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response) => {
    try {
        const result = await query<{ id: string; email: string; is_admin: boolean }>(
            'SELECT id, email, is_admin FROM users WHERE id = $1',
            [req.userId]
        );
        if (!result.rows[0]) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/logout (stateless JWT – just acknowledge)
router.post('/logout', (_, res: Response) => {
    res.json({ message: 'Logged out' });
});

export default router;
