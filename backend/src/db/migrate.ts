import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './client';

async function migrate() {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    const client = await pool.connect();
    try {
        console.log('🔄 Running migrations…');
        await client.query(schema);
        console.log('✅ Migrations complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
