import { Router, Response } from 'express';
import { z } from 'zod';
import { query } from '../db/client';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { broadcastEvent } from '../services/sse';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

const ProductSchema = z.object({
    category_id: z.number().int().positive(),
    name_he: z.string().min(1).max(200),
    name_en: z.string().min(1).max(200),
    description_he: z.string().optional(),
    description_en: z.string().optional(),
    price_nis: z.number().positive(),
    weight_options: z.array(z.object({ label: z.string(), grams: z.number() })).default([]),
    unit: z.enum(['kg', 'unit', 'portion']).default('kg'),
    is_available: z.boolean().default(true),
    is_kosher: z.boolean().default(true),
    kosher_cert_text: z.string().optional(),
    image_url: z.string().optional(),
});

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { category, available } = req.query;
        let sql = `
      SELECT p.*, c.name_he AS category_name_he, c.name_en AS category_name_en, c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
        const params: unknown[] = [];
        if (category) {
            params.push(category);
            sql += ` AND c.slug = $${params.length}`;
        }
        if (available === 'true') sql += ' AND p.is_available = true';
        sql += ' ORDER BY c.sort_order, p.name_he';
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error('[Products] GET error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await query(
            `SELECT p.*, c.name_he AS category_name_he, c.name_en AS category_name_en, c.slug AS category_slug
       FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = $1`,
            [req.params.id]
        );
        if (!result.rows[0]) { res.status(404).json({ error: 'Product not found' }); return; }
        res.json(result.rows[0]);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/products (admin)
router.post('/', authenticateJWT, requireAdmin, validate(ProductSchema), async (req: AuthRequest, res: Response) => {
    const b = req.body;
    try {
        const result = await query(
            `INSERT INTO products (category_id,name_he,name_en,description_he,description_en,price_nis,weight_options,unit,is_available,is_kosher,kosher_cert_text,image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [b.category_id, b.name_he, b.name_en, b.description_he, b.description_en, b.price_nis, JSON.stringify(b.weight_options), b.unit, b.is_available, b.is_kosher, b.kosher_cert_text, b.image_url]
        );
        const product = result.rows[0];
        await query(
            "INSERT INTO audit_log (entity_type,entity_id,action,new_value,performed_by) VALUES ('product',$1,'create',$2,$3)",
            [product.id, JSON.stringify(product), req.userId]
        );
        broadcastEvent('product_created', product);
        res.status(201).json(product);
    } catch (err) {
        console.error('[Products] POST error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/products/:id (admin)
router.put('/:id', authenticateJWT, requireAdmin, validate(ProductSchema.partial()), async (req: AuthRequest, res: Response) => {
    const b = req.body;
    try {
        const existing = await query('SELECT * FROM products WHERE id=$1', [req.params.id]);
        if (!existing.rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
        const result = await query(
            `UPDATE products SET
        category_id=COALESCE($1,category_id), name_he=COALESCE($2,name_he), name_en=COALESCE($3,name_en),
        description_he=COALESCE($4,description_he), description_en=COALESCE($5,description_en),
        price_nis=COALESCE($6,price_nis), weight_options=COALESCE($7::jsonb,weight_options),
        unit=COALESCE($8,unit), is_available=COALESCE($9,is_available), is_kosher=COALESCE($10,is_kosher),
        kosher_cert_text=COALESCE($11,kosher_cert_text), image_url=COALESCE($12,image_url)
       WHERE id=$13 RETURNING *`,
            [b.category_id, b.name_he, b.name_en, b.description_he, b.description_en, b.price_nis,
            b.weight_options ? JSON.stringify(b.weight_options) : null,
            b.unit, b.is_available, b.is_kosher, b.kosher_cert_text, b.image_url, req.params.id]
        );
        const updated = result.rows[0];
        await query(
            "INSERT INTO audit_log (entity_type,entity_id,action,old_value,new_value,performed_by) VALUES ('product',$1,'update',$2,$3,$4)",
            [updated.id, JSON.stringify(existing.rows[0]), JSON.stringify(updated), req.userId]
        );
        broadcastEvent('product_updated', updated);
        res.json(updated);
    } catch (err) {
        console.error('[Products] PUT error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const existing = await query('SELECT * FROM products WHERE id=$1', [req.params.id]);
        if (!existing.rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
        await query('DELETE FROM products WHERE id=$1', [req.params.id]);
        await query(
            "INSERT INTO audit_log (entity_type,entity_id,action,old_value,performed_by) VALUES ('product',$1,'delete',$2,$3)",
            [req.params.id, JSON.stringify(existing.rows[0]), req.userId]
        );
        broadcastEvent('product_deleted', { id: req.params.id });
        res.json({ message: 'Deleted' });
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/products/:id/availability (admin)
router.patch('/:id/availability', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
    const { is_available } = req.body;
    try {
        const result = await query(
            'UPDATE products SET is_available=$1 WHERE id=$2 RETURNING *',
            [is_available, req.params.id]
        );
        if (!result.rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
        broadcastEvent('product_availability_changed', result.rows[0]);
        res.json(result.rows[0]);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/products/export/csv (admin)
router.get('/export/csv', authenticateJWT, requireAdmin, async (_req, res: Response) => {
    try {
        const result = await query('SELECT * FROM products ORDER BY name_he');
        const csv = stringify(result.rows, { header: true });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
        res.send(csv);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// POST /api/products/import/csv (admin)
router.post('/import/csv', authenticateJWT, requireAdmin, upload.single('file'), async (req: AuthRequest, res: Response) => {
    if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
    try {
        const records = parse(req.file.buffer, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
        let imported = 0;
        for (const row of records) {
            await query(
                `INSERT INTO products (category_id,name_he,name_en,description_he,description_en,price_nis,unit,is_available,is_kosher,kosher_cert_text)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT DO NOTHING`,
                [row.category_id, row.name_he, row.name_en, row.description_he, row.description_en,
                parseFloat(row.price_nis), row.unit ?? 'kg', row.is_available !== 'false',
                row.is_kosher !== 'false', row.kosher_cert_text]
            );
            imported++;
        }
        res.json({ imported });
    } catch (err) {
        console.error('[Products] CSV import error:', err);
        res.status(400).json({ error: 'Failed to import CSV', details: String(err) });
    }
});

// GET /api/categories
router.get('/categories/all', async (_req, res) => {
    try {
        const result = await query('SELECT * FROM categories ORDER BY sort_order');
        res.json(result.rows);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
