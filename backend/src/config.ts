import 'dotenv/config';

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
}

export const config = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    db: {
        host: process.env.POSTGRES_HOST ?? 'localhost',
        port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
        database: process.env.POSTGRES_DB ?? 'haatzil',
        user: process.env.POSTGRES_USER ?? 'haatzil_user',
        password: requireEnv('POSTGRES_PASSWORD'),
    },
    smtp: {
        host: process.env.SMTP_HOST ?? '',
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? '',
        from: process.env.SMTP_FROM ?? 'no-reply@haatzil.co.il',
    },
    adminEmail: process.env.ADMIN_EMAIL ?? 'admin@haatzil.co.il',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin1234!',
    // Redis – optional. Leave blank to disable caching/session store.
    redisUrl: process.env.REDIS_URL ?? '',
} as const;
