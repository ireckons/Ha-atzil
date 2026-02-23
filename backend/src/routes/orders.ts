import { Router, Response } from 'express';
import { z } from 'zod';
import { query } from '../db/client';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { orderLimiter } from '../middleware/rateLimit';
import { broadcastEvent } from '../services/sse';
import { addSSEClient, removeSSEClient } from '../services/sse';

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

// POST /api/orders
router.post('/', orderLimiter, validate(CreateOrderSchema), async (req, res) => {
    const b = req.body as z.infer<typeof CreateOrderSchema>;
    const client = await (await import('../db/client')).pool.connect();
    try {
        await client.query('BEGIN');

        // Check slot capacity
        const slotResult = await client.query<{ capacity: number; booked_count: number }>(
            'SELECT capacity, booked_count FROM pickup_slots WHERE id=$1 AND is_active=true FOR UPDATE',
            [b.pickup_slot_id]
        );
        const slot = slotResult.rows[0];
        if (!slot) { await client.query('ROLLBACK'); res.status(400).json({ error: 'Pickup slot not found or inactive' }); return; }
        if (slot.booked_count >= slot.capacity) { await client.query('ROLLBACK'); res.status(400).json({ error: 'Pickup slot is fully booked' }); return; }

        // Fetch product prices
        let total = 0;
        const itemData: Array<{ product_id: string; name_he: string; name_en: string; price_nis: number; quantity: number; weight_g?: number; subtotal: number }> = [];
        for (const item of b.items) {
            const pResult = await client.query<{ price_nis: string; name_he: string; name_en: string }>(
                'SELECT price_nis, name_he, name_en FROM products WHERE id=$1 AND is_available=true',
                [item.product_id]
            );
            const product = pResult.rows[0];
            if (!product) { await client.query('ROLLBACK'); res.status(400).json({ error: `Product ${item.product_id} not found or unavailable` }); return; }
            const price = parseFloat(product.price_nis);
            const weightFactor = item.weight_g ? item.weight_g / 1000 : 1;
            const subtotal = price * item.quantity * weightFactor;
            total += subtotal;
            itemData.push({ product_id: item.product_id, name_he: product.name_he, name_en: product.name_en, price_nis: price, quantity: item.quantity, weight_g: item.weight_g, subtotal });
        }

        // Create order
        const orderResult = await client.query<{ id: string; order_number: string }>(
            `INSERT INTO orders (order_number,customer_name,customer_phone,customer_email,pickup_slot_id,notes,total_nis)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, order_number`,
            [generateOrderNumber(), b.customer_name, b.customer_phone, b.customer_email, b.pickup_slot_id, b.notes, total.toFixed(2)]
        );
        const order = orderResult.rows[0];

        // Create order items
        for (const item of itemData) {
            await client.query(
                'INSERT INTO order_items (order_id,product_id,name_he,name_en,price_nis,quantity,weight_g,subtotal_nis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
                [order.id, item.product_id, item.name_he, item.name_en, item.price_nis, item.quantity, item.weight_g ?? null, item.subtotal.toFixed(2)]
            );
        }

        // Increment booked_count
        await client.query('UPDATE pickup_slots SET booked_count=booked_count+1 WHERE id=$1', [b.pickup_slot_id]);

        await client.query('COMMIT');

        // Fetch full order
        const fullOrder = await query(
            `SELECT o.*, ps.slot_date, ps.slot_time FROM orders o JOIN pickup_slots ps ON o.pickup_slot_id=ps.id WHERE o.id=$1`,
            [order.id]
        );

        broadcastEvent('order_created', fullOrder.rows[0]);
        res.status(201).json(fullOrder.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('[Orders] Create error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// GET /api/orders (admin)
router.get('/', authenticateJWT, requireAdmin, async (req, res) => {
    try {
        const { status, date, search, page = '1', limit = '50' } = req.query;
        let sql = `
      SELECT o.*, ps.slot_date, ps.slot_time,
        json_agg(json_build_object('id',oi.id,'name_he',oi.name_he,'name_en',oi.name_en,'quantity',oi.quantity,'weight_g',oi.weight_g,'price_nis',oi.price_nis,'subtotal_nis',oi.subtotal_nis)) AS items
      FROM orders o
      JOIN pickup_slots ps ON o.pickup_slot_id = ps.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
        const params: unknown[] = [];
        if (status) { params.push(status); sql += ` AND o.status=$${params.length}`; }
        if (date) { params.push(date); sql += ` AND ps.slot_date=$${params.length}`; }
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND (o.customer_name ILIKE $${params.length} OR o.customer_phone ILIKE $${params.length})`;
        }
        sql += ' GROUP BY o.id, ps.slot_date, ps.slot_time ORDER BY o.created_at DESC';
        const offset = (parseInt(String(page)) - 1) * parseInt(String(limit));
        params.push(parseInt(String(limit))); sql += ` LIMIT $${params.length}`;
        params.push(offset); sql += ` OFFSET $${params.length}`;
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error('[Orders] GET error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await query(
            `SELECT o.*, ps.slot_date, ps.slot_time,
        json_agg(json_build_object('id',oi.id,'name_he',oi.name_he,'name_en',oi.name_en,'quantity',oi.quantity,'weight_g',oi.weight_g,'price_nis',oi.price_nis,'subtotal_nis',oi.subtotal_nis)) AS items
       FROM orders o JOIN pickup_slots ps ON o.pickup_slot_id=ps.id LEFT JOIN order_items oi ON o.id=oi.order_id
       WHERE o.id=$1 GROUP BY o.id, ps.slot_date, ps.slot_time`,
            [req.params.id]
        );
        if (!result.rows[0]) { res.status(404).json({ error: 'Order not found' }); return; }
        res.json(result.rows[0]);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'ready', 'collected', 'cancelled'];
    if (!validStatuses.includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; }
    try {
        const existing = await query<{ status: string }>('SELECT status FROM orders WHERE id=$1', [req.params.id]);
        if (!existing.rows[0]) { res.status(404).json({ error: 'Order not found' }); return; }
        const result = await query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
        const updated = result.rows[0];
        // Audit log
        await query(
            "INSERT INTO audit_log (entity_type,entity_id,action,old_value,new_value,performed_by) VALUES ('order',$1,'status_change',$2,$3,$4)",
            [req.params.id, JSON.stringify({ status: existing.rows[0].status }), JSON.stringify({ status }), req.userId]
        );
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
        const result = await query(
            "SELECT * FROM audit_log WHERE entity_type='order' AND entity_id=$1 ORDER BY performed_at DESC",
            [req.params.id]
        );
        res.json(result.rows);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
