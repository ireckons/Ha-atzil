import { Router, Response } from 'express';
import { z } from 'zod';
import { getAllEntities, getEntity, saveEntity, redis, uuidv4 } from '../db/client';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { orderLimiter } from '../middleware/rateLimit';
import { broadcastEvent, addSSEClient, removeSSEClient } from '../services/sse';

const router = Router();

// SSE endpoint for admin live updates
router.get('/stream', authenticateJWT, requireAdmin, (req: AuthRequest, res: Response) => {
    const clientId = `admin_${req.userId}_${Date.now()}`;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
    res.write('event: connected\ndata: {"status":"ok"}\n\n');
    addSSEClient(clientId, res);
    req.on('close', () => removeSSEClient(clientId));
});

function generateOrderNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(Math.random() * 9000 + 1000);
    return `HA-${date}-${rand}`;
}

const OrderItemSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    weight_g: z.number().int().positive().optional(),
});

const CreateOrderSchema = z.object({
    customer_name: z.string().min(2).max(100),
    customer_phone: z.string().min(9).max(20),
    customer_email: z.string().email().optional(),
    pickup_slot_id: z.string().uuid(),
    notes: z.string().max(500).optional(),
    items: z.array(OrderItemSchema).min(1),
});

type PickupSlot = { id: string; slot_date: string; slot_time: string; capacity: number; booked_count: number; is_active: boolean };
type Product = { id: string; name_he: string; name_en: string; price_nis: number; is_available: boolean };
type OrderItem = { product_id: string; name_he: string; name_en: string; price_nis: number; quantity: number; weight_g?: number; subtotal_nis: string };
type Order = { id: string; order_number: string; customer_name: string; customer_phone: string; customer_email: string; pickup_slot_id: string; status: string; notes: string; total_nis: string; created_at: string; updated_at: string; items: OrderItem[] };

// POST /api/orders
router.post('/', orderLimiter, validate(CreateOrderSchema), async (req, res) => {
    const b = req.body as z.infer<typeof CreateOrderSchema>;
    try {
        const slot = await getEntity<PickupSlot>('pickup_slot', b.pickup_slot_id);
        if (!slot || !slot.is_active) { res.status(400).json({ error: 'Pickup slot not found or inactive' }); return; }
        if (slot.booked_count >= slot.capacity) { res.status(400).json({ error: 'Pickup slot is fully booked' }); return; }

        let total = 0;
        const itemData: OrderItem[] = [];
        for (const item of b.items) {
            const product = await getEntity<Product>('product', item.product_id);
            if (!product || !product.is_available) { res.status(400).json({ error: `Product ${item.product_id} not found or unavailable` }); return; }
            const price = Number(product.price_nis);
            const weightFactor = item.weight_g ? item.weight_g / 1000 : 1;
            const subtotal = price * item.quantity * weightFactor;
            total += subtotal;
            itemData.push({ product_id: item.product_id, name_he: product.name_he, name_en: product.name_en, price_nis: price, quantity: item.quantity, weight_g: item.weight_g, subtotal_nis: subtotal.toFixed(2) });
        }

        const id = uuidv4();
        const now = new Date().toISOString();
        const order: Order = {
            id,
            order_number: generateOrderNumber(),
            customer_name: b.customer_name,
            customer_phone: b.customer_phone,
            customer_email: b.customer_email || '',
            pickup_slot_id: b.pickup_slot_id,
            status: 'pending',
            notes: b.notes || '',
            total_nis: total.toFixed(2),
            created_at: now,
            updated_at: now,
            items: itemData
        };

        slot.booked_count += 1;
        await saveEntity('pickup_slot', slot.id, slot);
        await saveEntity('order', id, order);

        const fullOrder = { ...order, slot_date: slot.slot_date, slot_time: slot.slot_time };
        broadcastEvent('order_created', fullOrder);
        res.status(201).json(fullOrder);
    } catch (err) {
        console.error('[Orders] Create error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/orders (admin)
router.get('/', authenticateJWT, requireAdmin, async (req, res) => {
    try {
        const { status, date, search, page = '1', limit = '50' } = req.query;
        let orders = await getAllEntities<Order>('order');

        const slots = await getAllEntities<PickupSlot>('pickup_slot');
        const slotMap = new Map<string, PickupSlot>();
        slots.forEach(s => slotMap.set(s.id, s));

        const enrichedOrders = orders.map(o => {
            const s = slotMap.get(o.pickup_slot_id);
            return { ...o, slot_date: s?.slot_date || '', slot_time: s?.slot_time || '' };
        });

        let filtered = enrichedOrders;
        if (status) filtered = filtered.filter(o => o.status === status);
        if (date) filtered = filtered.filter(o => o.slot_date === date);
        if (search) {
            const term = String(search).toLowerCase();
            filtered = filtered.filter(o => o.customer_name?.toLowerCase().includes(term) || o.customer_phone?.includes(term));
        }

        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const offset = (Number(page) - 1) * Number(limit);
        const paginated = filtered.slice(offset, offset + Number(limit));

        res.json(paginated);
    } catch (err) {
        console.error('[Orders] GET error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await getEntity<Order>('order', req.params.id);
        if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
        const slot = await getEntity<PickupSlot>('pickup_slot', order.pickup_slot_id);
        res.json({ ...order, slot_date: slot?.slot_date || '', slot_time: slot?.slot_time || '' });
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'ready', 'collected', 'cancelled'];
    if (!validStatuses.includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; }
    try {
        const existing = await getEntity<Order>('order', req.params.id);
        if (!existing) { res.status(404).json({ error: 'Order not found' }); return; }

        const updated = { ...existing, status, updated_at: new Date().toISOString() };
        await saveEntity('order', req.params.id, updated);

        await redis.lpush(`audit_log:order:${req.params.id}`, JSON.stringify({ action: 'status_change', old_value: { status: existing.status }, new_value: { status }, performed_by: req.userId, date: updated.updated_at }));

        broadcastEvent('order_status_changed', updated);
        res.json(updated);
    } catch (err) {
        console.error('[Orders] PATCH status error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/orders/:id/audit
router.get('/:id/audit', authenticateJWT, requireAdmin, async (req, res) => {
    try {
        const logsStr = await redis.lrange(`audit_log:order:${req.params.id}`, 0, -1);
        const logs = logsStr.map(l => JSON.parse(l));
        res.json(logs);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
