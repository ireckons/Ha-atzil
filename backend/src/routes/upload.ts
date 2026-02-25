import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Save uploaded images to disk in the uploads/ directory
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `${uuidv4()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// POST /api/upload/image
router.post('/image', authenticateJWT, requireAdmin, upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No image file provided' });
            return;
        }
        // Return a URL that points to the static /uploads endpoint
        const url = `/uploads/${req.file.filename}`;
        res.status(201).json({ url });
    } catch (err) {
        console.error('[Upload] POST error:', err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;
