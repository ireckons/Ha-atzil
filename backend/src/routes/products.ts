import { Router, Response } from 'express';
import { z } from 'zod';
import { getAllEntities, getEntity, saveEntity, deleteEntity, uuidv4, redis } from '../db/client';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { broadcastEvent } from '../services/sse';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import multer from 'multer';
import { defaultProducts } from '../db/default_products';

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

type Category = { id: number; slug: string; name_he: string; name_en: string; sort_order: number };
type Product = z.infer<typeof ProductSchema> & { id: string; created_at: string; updated_at: string };

// Helper to get category details
async function getCategoryData() {
    const cats = await getAllEntities<Category>('category');
    const catMap = new Map<number, Category>();
    cats.forEach(c => catMap.set(Number(c.id), c));
    return { cats, catMap };
}

async function ensureProductsSeeded() {
    try {
        const prods = await getAllEntities<Product>('product');
        if (prods.length === 0) {
            console.log('Seeding default products...');
            for (const prod of defaultProducts) {
                // @ts-ignore - bypass strict typing for seed
                await saveEntity('product', prod.id, {
                    ...prod,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
            console.log('Finished seeding products!');
        }
    } catch (err) {
        console.error('Failed to seed products:', err);
    }
}
ensureProductsSeeded();

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { category, available } = req.query;
        const products = await getAllEntities<Product>('product');
        const { catMap } = await getCategoryData();

        let filtered = products.map(p => {
            const c = catMap.get(Number(p.category_id));
            return {
                ...p,
                category_name_he: c?.name_he || '',
                category_name_en: c?.name_en || '',
                category_slug: c?.slug || '',
                category_sort_order: c?.sort_order || 999
            };
        });

        if (category) {
            filtered = filtered.filter(p => p.category_slug === String(category));
        }
        if (available === 'true') {
            filtered = filtered.filter(p => p.is_available === true);
        }

        filtered.sort((a, b) => {
            if (a.category_sort_order !== b.category_sort_order) return a.category_sort_order - b.category_sort_order;
            return a.name_he.localeCompare(b.name_he, 'he');
        });

        res.json(filtered);
    } catch (err) {
        console.error('[Products] GET error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await getEntity<Product>('product', req.params.id);
        if (!product) { res.status(404).json({ error: 'Product not found' }); return; }

        const c = await getEntity<Category>('category', String(product.category_id));
        res.json({
            ...product,
            category_name_he: c?.name_he || '',
            category_name_en: c?.name_en || '',
            category_slug: c?.slug || ''
        });
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/products (admin)
router.post('/', authenticateJWT, requireAdmin, validate(ProductSchema), async (req: AuthRequest, res: Response) => {
    const b = req.body;
    try {
        const id = uuidv4();
        const now = new Date().toISOString();
        const newProduct: Product = { ...b, id, created_at: now, updated_at: now };

        await saveEntity('product', id, newProduct);
        await redis.lpush(`audit_log:product:${id}`, JSON.stringify({ action: 'create', new_value: newProduct, performed_by: req.userId, date: now }));

        broadcastEvent('product_created', newProduct);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('[Products] POST error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/products/:id (admin)
router.put('/:id', authenticateJWT, requireAdmin, validate(ProductSchema.partial()), async (req: AuthRequest, res: Response) => {
    const b = req.body;
    try {
        const existing = await getEntity<Product>('product', req.params.id);
        if (!existing) { res.status(404).json({ error: 'Not found' }); return; }

        const updated = { ...existing, ...b, updated_at: new Date().toISOString() };
        await saveEntity('product', req.params.id, updated);

        await redis.lpush(`audit_log:product:${req.params.id}`, JSON.stringify({ action: 'update', old_value: existing, new_value: updated, performed_by: req.userId, date: updated.updated_at }));

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
        const existing = await getEntity<Product>('product', req.params.id);
        if (!existing) { res.status(404).json({ error: 'Not found' }); return; }

        await deleteEntity('product', req.params.id);
        await redis.lpush(`audit_log:product:${req.params.id}`, JSON.stringify({ action: 'delete', old_value: existing, performed_by: req.userId, date: new Date().toISOString() }));

        broadcastEvent('product_deleted', { id: req.params.id });
        res.json({ message: 'Deleted' });
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/products/:id/availability (admin)
router.patch('/:id/availability', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
    const { is_available } = req.body;
    try {
        const existing = await getEntity<Product>('product', req.params.id);
        if (!existing) { res.status(404).json({ error: 'Not found' }); return; }

        const updated = { ...existing, is_available: Boolean(is_available), updated_at: new Date().toISOString() };
        await saveEntity('product', req.params.id, updated);

        broadcastEvent('product_availability_changed', updated);
        res.json(updated);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/products/export/csv (admin)
router.get('/export/csv', authenticateJWT, requireAdmin, async (_req, res: Response) => {
    try {
        const products = await getAllEntities<Product>('product');
        products.sort((a, b) => a.name_he.localeCompare(b.name_he, 'he'));

        const csv = stringify(products, { header: true });
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
        const now = new Date().toISOString();
        for (const row of records) {
            const id = uuidv4();
            const product: Product = {
                id,
                category_id: Number(row.category_id),
                name_he: row.name_he,
                name_en: row.name_en,
                description_he: row.description_he,
                description_en: row.description_en,
                price_nis: parseFloat(row.price_nis),
                weight_options: [],
                unit: (row.unit || 'kg') as 'kg' | 'unit' | 'portion',
                is_available: row.is_available !== 'false',
                is_kosher: row.is_kosher !== 'false',
                kosher_cert_text: row.kosher_cert_text,
                created_at: now,
                updated_at: now
            };
            await saveEntity('product', id, product);
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
        const cats = await getAllEntities<Category>('category');
        cats.sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
        res.json(cats);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
