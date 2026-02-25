import { Router } from 'express';

const router = Router();

// This route is no longer used – images are served as static files
// from frontend/public/images/products/ directly via Vite's dev server
// or from backend/uploads/ via express.static('/uploads')

router.get('/:id', (_req, res) => {
    res.status(410).json({ error: 'This image endpoint is deprecated. Images are now served as static files.' });
});

export default router;
