import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './client';

async function resetAdminPassword() {
    const email = 'admin@haatzil.co.il';
    const newPassword = 'Admin1234!';
    const hash = await bcrypt.hash(newPassword, 12);

    const client = await pool.connect();
    try {
        // Upsert admin user
        await client.query(
            `INSERT INTO users (email, password_hash, is_admin)
       VALUES ($1, $2, true)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
            [email, hash]
        );
        console.log(`✅ Admin password reset for ${email}`);
        console.log(`   Password: ${newPassword}`);
    } finally {
        client.release();
        await pool.end();
    }
}

resetAdminPassword().catch((err) => {
    console.error('Failed:', err.message);
    process.exit(1);
});
