import { Router, Response } from 'express';
import { z } from 'zod';
import { getAllEntities, saveEntity, uuidv4 } from '../db/client';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const SlotSchema = z.object({
    slot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    slot_time: z.string().regex(/^\d{2}:\d{2}$/),
    capacity: z.number().int().positive().default(10),
    is_active: z.boolean().default(true),
});

type PickupSlot = { id: string; slot_date: string; slot_time: string; capacity: number; booked_count: number; is_active: boolean };

// Helper to filter and sort slots
async function getProcessedSlots() {
    const slots = await getAllEntities<PickupSlot>('pickup_slot');
    return slots.map(s => ({
        ...s,
        available_count: s.capacity - (s.booked_count || 0)
    }));
}

// GET /api/pickup-slots
router.get('/', async (req, res) => {
    try {
        const { from, to } = req.query;
        let slots = await getProcessedSlots();

        // Only active and not fully booked
        slots = slots.filter(s => s.is_active && s.booked_count < s.capacity);

        if (from) slots = slots.filter(s => s.slot_date >= String(from));
        if (to) slots = slots.filter(s => s.slot_date <= String(to));

        // Only future slots
        const now = new Date();
        const curDate = now.toISOString().slice(0, 10);
        const curTime = now.toTimeString().slice(0, 5);

        slots = slots.filter(s => {
            if (s.slot_date > curDate) return true;
            if (s.slot_date === curDate && s.slot_time > curTime) return true;
            return false;
        });

        slots.sort((a, b) => {
            if (a.slot_date !== b.slot_date) return a.slot_date.localeCompare(b.slot_date);
            return a.slot_time.localeCompare(b.slot_time);
        });

        res.json(slots);
    } catch (err) {
        console.error('[Slots] GET error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/pickup-slots/admin (admin – all slots including past)
router.get('/admin', authenticateJWT, requireAdmin, async (req, res) => {
    try {
        const { date } = req.query;
        let slots = await getProcessedSlots();
        if (date) {
            slots = slots.filter(s => s.slot_date === String(date));
        }
        slots.sort((a, b) => {
            if (a.slot_date !== b.slot_date) return a.slot_date.localeCompare(b.slot_date);
            return a.slot_time.localeCompare(b.slot_time);
        });
        res.json(slots);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// POST /api/pickup-slots (admin)
router.post('/', authenticateJWT, requireAdmin, validate(SlotSchema), async (_req: AuthRequest, res: Response) => {
    const b = _req.body as z.infer<typeof SlotSchema>;
    try {
        const allSlots = await getAllEntities<PickupSlot>('pickup_slot');
        let existing = allSlots.find(s => s.slot_date === b.slot_date && s.slot_time === b.slot_time);

        if (existing) {
            existing.capacity = b.capacity;
            existing.is_active = b.is_active;
            await saveEntity('pickup_slot', existing.id, existing);
            res.status(201).json(existing);
        } else {
            const id = uuidv4();
            const newSlot: PickupSlot = {
                id,
                slot_date: b.slot_date,
                slot_time: b.slot_time,
                capacity: b.capacity,
                booked_count: 0,
                is_active: b.is_active
            };
            await saveEntity('pickup_slot', id, newSlot);
            res.status(201).json(newSlot);
        }
    } catch (err) {
        console.error('[Slots] POST error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/pickup-slots/:id (admin)
router.put('/:id', authenticateJWT, requireAdmin, validate(SlotSchema.partial()), async (_req: AuthRequest, res: Response) => {
    const b = _req.body;
    try {
        const slots = await getAllEntities<PickupSlot>('pickup_slot');
        const existing = slots.find(s => s.id === _req.params.id);

        if (!existing) { res.status(404).json({ error: 'Not found' }); return; }

        if (b.slot_date) existing.slot_date = b.slot_date;
        if (b.slot_time) existing.slot_time = b.slot_time;
        if (b.capacity !== undefined) existing.capacity = b.capacity;
        if (b.is_active !== undefined) existing.is_active = b.is_active;

        await saveEntity('pickup_slot', existing.id, existing);
        res.json(existing);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
