import fs from 'fs';
import path from 'path';
import { uploadBufferToGCS, dynamicBucketName } from './routes/upload';
import { getAllEntities, saveEntity } from './db/client';

async function main() {
    const localImagesDir = '/tmp/local_images';
    let uploadedCount = 0;
    
    console.log(`Starting migration from ${localImagesDir} to ${dynamicBucketName}...`);
    
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
                const publicUrl = await uploadBufferToGCS(buffer, mimetype, gcsPath);
                console.log(`Uploaded ${file} to ${publicUrl}`);
                uploadedCount++;
            }
        }
    } else {
        console.error("Local path not found:", localImagesDir);
    }

    // Run through products to update paths
    const products = await getAllEntities<any>('product');
    let updatedCount = 0;
    for (const p of products) {
        if (p.image_url && p.image_url.startsWith('/images/products/')) {
            p.image_url = `https://storage.googleapis.com/${dynamicBucketName}${p.image_url}`;
            await saveEntity('product', p.id, p);
            console.log(`Updated product path for ${p.name_he}`);
            updatedCount++;
        }
    }
    
    console.log(`Done! Uploaded: ${uploadedCount}, Updated DB records: ${updatedCount}`);
    process.exit(0);
}

main().catch(console.error);
