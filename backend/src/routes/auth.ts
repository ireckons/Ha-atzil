import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getEntity, saveEntity, getAllEntities, redis, uuidv4 } from '../db/client';
import { config } from '../config';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

type User = { id: string; email: string; password_hash: string; name: string; is_admin: boolean };

// POST /api/auth/login
router.post('/login', authLimiter, validate(LoginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body as z.infer<typeof LoginSchema>;
    try {
        const userId = await redis.hget('users:emails', email);
        if (!userId) { res.status(401).json({ error: 'Invalid credentials' }); return; }

        const user = await getEntity<User>('user', userId || '');
        if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return; }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return; }

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

// POST /api/auth/register
router.post('/register', authLimiter, validate(RegisterSchema), async (req: Request, res: Response) => {
    const { email, password, name } = req.body as z.infer<typeof RegisterSchema>;
    try {
        const existingId = await redis.hget('users:emails', email);
        if (existingId) { res.status(400).json({ error: 'Email already registered' }); return; }

        const hash = await bcrypt.hash(password, 10);
        const id = uuidv4();

        const user: User = { id, email, password_hash: hash, name, is_admin: false };
        await saveEntity('user', id, user);
        await redis.hset('users:emails', email, id);

        const token = jwt.sign(
            { userId: id, isAdmin: false },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
        );
        res.json({ token, isAdmin: false });
    } catch (err) {
        console.error('[Auth] Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
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

// POST /api/auth/bypass
router.post('/bypass', (_, res: Response) => {
    const token = jwt.sign(
        { userId: 'admin-bypass-id', isAdmin: true },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );
    res.json({ token, isAdmin: true });
});

export default router;
