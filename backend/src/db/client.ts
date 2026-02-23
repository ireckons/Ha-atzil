import { Pool } from 'pg';
import { config } from '../config';

export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('Unexpected DB error', err);
});

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    params?: unknown[]
): Promise<import('pg').QueryResult<T>> {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
        console.debug(`[DB] ${text.slice(0, 60)}\u2026 | ${duration}ms | rows: ${res.rowCount}`);
    }
    return res;
}
