import 'dotenv/config';
import { pool } from './client';

async function updateImages() {
    const client = await pool.connect();
    try {
        console.log('🖼️ Updating product images with Unsplash placeholders...');

        // Get all products
        const res = await client.query('SELECT id, name_en, category_id FROM products');
        const products = res.rows;

        // Curated, highly accurate direct photos from Unsplash for each specific product
        // Curated, unique, highly accurate direct photos from Unsplash
        const imageMap: Record<string, string> = {
            'ribeye steak': 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80',
            'beef tenderloin': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80',
            'chuck roast': 'https://images.unsplash.com/photo-1602848598968-98e39ed816b8?auto=format&fit=crop&w=800&q=80',
            'chuck eye roll': 'https://images.unsplash.com/photo-1628198595805-4f4b2382cffb?auto=format&fit=crop&w=800&q=80',
            'fresh beef liver': 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=800&q=80',

            'lamb chops': 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80',
            'lamb kebab': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
            'whole lamb shoulder': 'https://images.unsplash.com/photo-1621682859737-02bc0fdf7880?auto=format&fit=crop&w=800&q=80',
            'lamb leg': 'https://images.unsplash.com/photo-1601625906806-0b8bb9622d0b?auto=format&fit=crop&w=800&q=80',

            'chicken schnitzel': 'https://images.unsplash.com/photo-1599905260172-e19de50fc2fa?auto=format&fit=crop&w=800&q=80',
            'turkey shawarma': 'https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&w=800&q=80',
            'whole fresh chicken': 'https://images.unsplash.com/photo-1598515318182-167e71946892?auto=format&fit=crop&w=800&q=80',
            'chicken legs': 'https://images.unsplash.com/photo-1604503468306-202f1b0a7018?auto=format&fit=crop&w=800&q=80',
            'sliced turkey breast': 'https://images.unsplash.com/photo-1627367807090-cb5fa4aa3da9?auto=format&fit=crop&w=800&q=80',

            'ready beef patties': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80',
            'marinated ribeye': 'https://images.unsplash.com/photo-1620248439169-ad1785de04df?auto=format&fit=crop&w=800&q=80',
            'beef sausages': 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=800&q=80',
            'beef bone broth kit': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',

            'mehadrin beef selection': 'https://images.unsplash.com/photo-1615865417482-166943a5fbdf?auto=format&fit=crop&w=800&q=80',
            'mehadrin lamb for rosh hashana': 'https://images.unsplash.com/photo-1634789544710-53b018b3e8ad?auto=format&fit=crop&w=800&q=80',
            'whole turkey for holiday': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&w=800&q=80',
        };

        // Update each product's image_url
        for (const product of products) {
            const normalizedKey = product.name_en.trim().toLowerCase();
            const imageUrl = imageMap[normalizedKey] || 'https://images.unsplash.com/photo-1607116176195-b81b1f41f536?auto=format&fit=crop&w=800&q=80';

            await client.query(
                'UPDATE products SET image_url = $1 WHERE id = $2',
                [imageUrl, product.id]
            );
            console.log(`Updated ${product.name_en}`);
        }

        console.log('✅ All product images updated successfully.');
    } catch (err) {
        console.error('Error updating images:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

updateImages();
