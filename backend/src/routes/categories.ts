import { Router, Response } from 'express';
import { z } from 'zod';
import { getAllEntities, saveEntity, deleteEntity, uuidv4 } from '../db/client';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

export const CategorySchema = z.object({
    slug: z.string().min(1).max(100),
    name_he: z.string().min(1).max(100),
    name_en: z.string().min(1).max(100),
    sort_order: z.number().int().default(99),
    is_featured: z.boolean().default(false),
});

type Category = z.infer<typeof CategorySchema> & { id: string };

// Seed default categories if none exist
const defaultCategories = [
    { id: '1', slug: 'beef', name_he: 'בקר', name_en: 'Beef', sort_order: 1, is_featured: true },
    { id: '2', slug: 'lamb', name_he: 'כבש וטלה', name_en: 'Lamb', sort_order: 2, is_featured: true },
    { id: '3', slug: 'poultry', name_he: 'עוף והודו', name_en: 'Poultry', sort_order: 3, is_featured: true },
    { id: '4', slug: 'prepared', name_he: 'מוכן לבישול', name_en: 'Prepared Foods', sort_order: 4, is_featured: true },
    { id: '5', slug: 'kosher-special', name_he: 'מיוחדי כשרות', name_en: 'Kosher Specials', sort_order: 5, is_featured: true }
];

async function ensureCategoriesSeeded() {
    try {
        const cats = await getAllEntities<Category>('category');
        if (cats.length === 0) {
            for (const cat of defaultCategories) {
                await saveEntity('category', cat.id, cat);
            }
        }
    } catch (err) {
        console.error('Failed to seed categories:', err);
    }
}
ensureCategoriesSeeded(); // Run once on startup

// GET /api/categories
router.get('/', async (_req, res) => {
    try {
        const cats = await getAllEntities<Category>('category');
        cats.sort((a, b) => a.sort_order - b.sort_order);
        res.json(cats);
    } catch (err) {
        console.error('[Categories] GET error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/categories (admin)
router.post('/', authenticateJWT, requireAdmin, validate(CategorySchema), async (req: AuthRequest, res: Response) => {
    try {
        const id = uuidv4();
        const cats = await getAllEntities<Category>('category');
        const nextOrder = cats.length > 0 ? Math.max(...cats.map(c => c.sort_order || 0)) + 1 : 1;
        const cat = { ...req.body, id, sort_order: nextOrder };
        await saveEntity('category', id, cat);
        res.status(201).json(cat);
    } catch (err) {
        console.error('[Categories] POST error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/categories/:id (admin)
router.put('/:id', authenticateJWT, requireAdmin, validate(CategorySchema), async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;
        const cat = { id, ...req.body };
        await saveEntity('category', id, cat);
        res.json(cat);
    } catch (err) {
        console.error('[Categories] PUT error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        await deleteEntity('category', req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('[Categories] DELETE error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
