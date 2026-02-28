import 'dotenv/config';
import { saveEntity, redis, uuidv4 } from './client';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Trashing old redis data and seeding new mock data…');
    await redis.flushdb();

    // 1. Categories
    const categories = [
        { id: 1, slug: 'beef', name_he: 'בקר', name_en: 'Beef', sort_order: 1 },
        { id: 2, slug: 'lamb', name_he: 'כבש וטלה', name_en: 'Lamb', sort_order: 2 },
        { id: 3, slug: 'poultry', name_he: 'עוף והודו', name_en: 'Poultry', sort_order: 3 },
        { id: 4, slug: 'prepared', name_he: 'מוכן לבישול', name_en: 'Prepared Foods', sort_order: 4 },
        { id: 5, slug: 'kosher-special', name_he: 'מיוחדי כשרות', name_en: 'Kosher Specials', sort_order: 5 },
        { id: 6, slug: 'fish', name_he: 'דגים', name_en: 'Fish', sort_order: 6 },
    ];
    for (const c of categories) {
        await saveEntity('category', String(c.id), c);
    }
    console.log(`✅ Seeded ${categories.length} categories.`);

    // 2. Admin User
    const adminId = uuidv4();
    const hash = await bcrypt.hash('Admin1234!', 10);
    const adminUser = {
        id: adminId,
        email: 'admin@haatzil.co.il',
        password_hash: hash,
        name: 'Haatzil Admin',
        is_admin: true
    };
    await saveEntity('user', adminId, adminUser);
    await redis.hset('users:emails', adminUser.email, adminId);
    console.log('✅ Seeded admin user: admin@haatzil.co.il (Admin1234!)');

    // 3. Products
    const now = new Date().toISOString();
    const products = [
        // Beef
        { id: uuidv4(), category_id: 1, name_he: 'אנטריקוט טרי', name_en: 'Ribeye Steak', description_he: 'נתח פרמיום מהצלעות', description_en: 'Premium ribeye cut, beautifully marbled.', price_nis: 189, weight_options: [{ label: '300g', grams: 300 }, { label: '500g', grams: 500 }, { label: '1kg', grams: 1000 }], unit: 'kg', is_available: true, is_kosher: true, kosher_cert_text: 'Badatz Mehadrin', image_url: '/images/products/beef/ribeye.jpg', created_at: now, updated_at: now },
        // Lamb
        { id: uuidv4(), category_id: 2, name_he: 'צלעות כבש', name_en: 'Lamb Chops', description_he: 'צלעות כבש עסיסיות', description_en: 'Juicy lamb chops.', price_nis: 149, weight_options: [{ label: '400g', grams: 400 }, { label: '800g', grams: 800 }], unit: 'kg', is_available: true, is_kosher: true, kosher_cert_text: 'Badatz Mehadrin', image_url: '/images/products/lamb/lamb_chops.jpg', created_at: now, updated_at: now },
        // Fish
        { id: uuidv4(), category_id: 6, name_he: 'סלמון נורווגי טרי', name_en: 'Fresh Norwegian Salmon', description_he: 'פילה סלמון טרי', description_en: 'Fresh quality salmon fillet', price_nis: 139, weight_options: [{ label: '500g', grams: 500 }, { label: '1kg', grams: 1000 }], unit: 'kg', is_available: true, is_kosher: true, kosher_cert_text: 'Badatz Mehadrin Beit Shemesh', image_url: '', created_at: now, updated_at: now },
    ];
    for (const p of products) {
        await saveEntity('product', p.id, p);
    }
    console.log(`✅ Seeded ${products.length} products.`);

    console.log('✅ Seed complete.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
