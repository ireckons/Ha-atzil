import { Router, Response } from 'express';
import { z } from 'zod';
import { query } from '../db/client';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const SlotSchema = z.object({
    slot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    slot_time: z.string().regex(/^\d{2}:\d{2}$/),
    capacity: z.number().int().positive().default(10),
    is_active: z.boolean().default(true),
});

// GET /api/pickup-slots
router.get('/', async (req, res) => {
    try {
        const { from, to } = req.query;
        let sql = `
            SELECT id, slot_date, slot_time, capacity, booked_count, is_active,
                   capacity - booked_count AS available_count
            FROM pickup_slots
            WHERE is_active = true AND booked_count < capacity
        `;
        const params: unknown[] = [];

        if (from) {
            params.push(from);
            sql += ` AND slot_date >= $${params.length}`;
        }
        if (to) {
            params.push(to);
            sql += ` AND slot_date <= $${params.length}`;
        }

        // Only show future slots
        sql += ` AND (slot_date > CURRENT_DATE OR (slot_date = CURRENT_DATE AND slot_time > CURRENT_TIME))`;
        sql += ' ORDER BY slot_date, slot_time';

        const result = await query(sql, params);
        const rows = result.rows.map(row => ({
            ...row,
            is_active: Boolean(row.is_active)
        }));
        res.json(rows);
    } catch (err) {
        console.error('[Slots] GET error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/pickup-slots/admin (admin – all slots including past)
router.get('/admin', authenticateJWT, requireAdmin, async (req, res) => {
    try {
        const { date } = req.query;
        let sql = 'SELECT *, capacity - booked_count AS available_count FROM pickup_slots WHERE 1=1';
        const params: unknown[] = [];
        if (date) { params.push(date); sql += ` AND slot_date = $${params.length}`; }
        sql += ' ORDER BY slot_date, slot_time';
        const result = await query(sql, params);
        res.json(result.rows);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// POST /api/pickup-slots (admin)
router.post('/', authenticateJWT, requireAdmin, validate(SlotSchema), async (_req: AuthRequest, res: Response) => {
    const b = _req.body as z.infer<typeof SlotSchema>;
    try {
        const result = await query(
            'INSERT INTO pickup_slots (slot_date,slot_time,capacity,is_active) VALUES ($1,$2,$3,$4) ON CONFLICT (slot_date,slot_time) DO UPDATE SET capacity=$3,is_active=$4 RETURNING *',
            [b.slot_date, b.slot_time, b.capacity, b.is_active]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('[Slots] POST error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/pickup-slots/:id (admin)
router.put('/:id', authenticateJWT, requireAdmin, validate(SlotSchema.partial()), async (_req: AuthRequest, res: Response) => {
    const b = _req.body;
    try {
        const result = await query(
            'UPDATE pickup_slots SET slot_date=COALESCE($1,slot_date),slot_time=COALESCE($2,slot_time),capacity=COALESCE($3,capacity),is_active=COALESCE($4,is_active) WHERE id=$5 RETURNING *',
            [b.slot_date, b.slot_time, b.capacity, b.is_active, _req.params.id]
        );
        if (!result.rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
        res.json(result.rows[0]);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
