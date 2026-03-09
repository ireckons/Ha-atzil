import { Router, Request, Response } from 'express';
import { Storage, Bucket } from '@google-cloud/storage';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { authenticateJWT, requireAdmin } from '../middleware/auth';
import { getAllEntities, saveEntity } from '../db/client';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

let storage: Storage;
let gcsBucket: Bucket | null = null;
export let dynamicBucketName = '';

try {
    if (process.env.GCS_CREDENTIALS) {
        // If the user injected the raw JSON string via .env
        let credentialsString = process.env.GCS_CREDENTIALS;
        const credentials = JSON.parse(credentialsString);
        if (credentials.private_key) {
             // Fix private key newline escaping which often gets mangled by docker-compose and .env parsers
             credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        storage = new Storage({ credentials });
    } else {
        // Fallback to local files (mostly for historical local runs)
        const keyFile = process.env.GCS_KEY_FILENAME || './project-bisale-02bab5eb1db0.json';
        storage = new Storage({ keyFilename: keyFile });
    }
    
    // Bind directly to the user-specified bucket to bypass project-wide IAM restrictions
    if (process.env.GCS_BUCKET_NAME) {
        dynamicBucketName = process.env.GCS_BUCKET_NAME;
        gcsBucket = storage.bucket(dynamicBucketName);
        console.log(`[GCS] Bound directly to configured bucket: ${dynamicBucketName}`);
    } else {
        // Fallback to legacy auto-discovery if no bucket name is provided
        storage.getBuckets().then(([buckets]) => {
            if (buckets.length > 0) {
                gcsBucket = buckets[0];
                dynamicBucketName = gcsBucket.name;
                console.log(`[GCS] Successfully discovered bucket: ${dynamicBucketName}`);
            } else {
                console.warn('[GCS] No buckets found in this project. Please create one.');
            }
        }).catch(err => {
            console.error('[GCS] Failed to fetch buckets. Check your JSON key permissions:', err.message);
        });
    }

} catch (err) {
    console.error('[GCS] Failed to initialize storage client. Is the JSON key file present?', err);
}

// POST /api/upload/image
router.post('/image', authenticateJWT, requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
             res.status(400).json({ error: 'No image file provided' });
             return;
        }

        if (!gcsBucket) {
             res.status(500).json({ error: 'Google Cloud Storage is not properly configured on the server.' });
             return;
        }

        const originalName = req.file.originalname;
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        const fileName = `images/uploads/${Date.now()}-${Math.round(Math.random() * 1000)}${extension}`;
        
        const blob = gcsBucket.file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: req.file.mimetype,
        });

        blobStream.on('error', (err: any) => {
            console.error('[GCS] Upload stream error:', err);
            res.status(500).json({ error: `GCS Error: ${err.message || 'Failed to upload image'}` });
        });

        blobStream.on('finish', () => {
            // Construct the public URL
            const publicUrl = `https://storage.googleapis.com/${dynamicBucketName}/${fileName}`;
            res.status(200).json({ url: publicUrl });
        });

        blobStream.end(req.file.buffer);

    } catch (err: any) {
        console.error('[GCS] Image upload error:', err);
        res.status(500).json({ error: `Internal error: ${err.message || err}` });
    }
});

export async function uploadBufferToGCS(buffer: Buffer, mimetype: string, destinationPath: string): Promise<string> {
    if (!gcsBucket) throw new Error('Bucket not initialized');
    
    const blob = gcsBucket.file(destinationPath);
    await blob.save(buffer, {
        resumable: false,
        contentType: mimetype
    });
    return `https://storage.googleapis.com/${dynamicBucketName}/${destinationPath}`;
}

// POST /api/upload/migrate-local-images
router.post('/migrate-local-images', authenticateJWT, requireAdmin, async (_req: Request, res: Response) => {
    try {
        if (!gcsBucket) {
             res.status(500).json({ error: 'Google Cloud Storage is not properly configured on the server.' });
             return;
        }

        const localImagesDir = path.resolve(process.cwd(), '../frontend/public/images/products');
        
        let uploadedCount = 0;
        if (fs.existsSync(localImagesDir)) {
            const categories = fs.readdirSync(localImagesDir);
            for (const cat of categories) {
                const catPath = path.join(localImagesDir, cat);
                if (!fs.statSync(catPath).isDirectory()) continue;
                
                const files = fs.readdirSync(catPath);
                for (const file of files) {
                    if (!file.endsWith('.jpg') && !file.endsWith('.png')) continue;
                    
                    const filePath = path.join(catPath, file);
                    const buffer = fs.readFileSync(filePath);
                    const mimetype = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
                    
                    const gcsPath = `images/products/${cat}/${file}`;
                    await uploadBufferToGCS(buffer, mimetype, gcsPath);
                    uploadedCount++;
                }
            }
        }

        // Run through products to update paths
        const products = await getAllEntities<any>('product');
        let updatedCount = 0;
        for (const p of products) {
            if (p.image_url && p.image_url.startsWith('/images/products/')) {
                p.image_url = `https://storage.googleapis.com/${dynamicBucketName}${p.image_url}`;
                await saveEntity('product', p.id, p);
                updatedCount++;
            }
        }
        
        res.json({ success: true, uploadedCount, updatedCount, bucket: dynamicBucketName });
    } catch (err: any) {
        console.error('[Migration] Error:', err);
        res.status(500).json({ error: err.message || 'Error occurred during migration' });
    }
});

// GET /api/upload/images
// Returns a list of all uploaded images in the GCS bucket
router.get('/images', authenticateJWT, requireAdmin, async (_req: Request, res: Response) => {
    try {
        if (!gcsBucket) {
             res.status(500).json({ error: 'Google Cloud Storage is not properly configured on the server.' });
             return;
        }

        // Fetch all files in the bucket under images/products/ and images/uploads/
        const [files] = await gcsBucket.getFiles({ prefix: 'images/' });
        
        // Filter out folders and return the public URLs
        const urls = files
            .filter(file => !file.name.endsWith('/'))
            .map(file => `https://storage.googleapis.com/${dynamicBucketName}/${file.name}`)
            // Sort by most recently updated so new images appear first
            .sort((a, b) => {
                const f1 = files.find(f => f.name === a.split('/').pop());
                const f2 = files.find(f => f.name === b.split('/').pop());
                return (f2?.metadata?.updated ? new Date(f2.metadata.updated).getTime() : 0) - 
                       (f1?.metadata?.updated ? new Date(f1.metadata.updated).getTime() : 0);
            });

        res.json({ images: urls });
    } catch (err) {
        console.error('[GCS] Error listing images:', err);
        res.status(500).json({ error: 'Failed to list images' });
    }
});

export default router;
