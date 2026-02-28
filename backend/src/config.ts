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
    adminEmail: process.env.ADMIN_EMAIL ?? 'admin@haatzil.co.il',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin1234!',
    redisUrl: requireEnv('REDIS_URL'),
} as const;
