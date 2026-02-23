import 'dotenv/config';
import { Pool } from 'pg';

// ╔═══════════════════════════════════════════════╗
// ║  QA DB Bridge – ISOLATED from production DB   ║
// ║  Uses qa-db-bridge/.env (not backend/.env)    ║
// ╚═══════════════════════════════════════════════╝

const qaPool = new Pool({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
    database: process.env.POSTGRES_DB ?? 'haatzil_qa',
    user: process.env.POSTGRES_USER ?? 'qa_user',
    password: process.env.POSTGRES_PASSWORD,
});

async function main() {
    const client = await qaPool.connect();
    try {
        const res = await client.query('SELECT NOW() AS now, current_database() AS db');
        console.log('✅ QA DB connected:', res.rows[0]);

        const products = await client.query('SELECT COUNT(*) FROM products');
        console.log(`📦 Products in QA DB: ${products.rows[0].count}`);

        const orders = await client.query('SELECT COUNT(*) FROM orders');
        console.log(`📋 Orders in QA DB: ${orders.rows[0].count}`);
    } finally {
        client.release();
        await qaPool.end();
    }
}

main().catch((err) => {
    console.error('QA DB connection failed:', err.message);
    console.error('→ Check qa-db-bridge/.env and ensure QA postgres is running');
    process.exit(1);
});
