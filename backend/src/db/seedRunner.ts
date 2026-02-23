import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './client';

async function seed() {
    const seedSql = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
    const client = await pool.connect();
    try {
        console.log('🌱 Running seed…');
        await client.query(seedSql);
        console.log('✅ Seed complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
