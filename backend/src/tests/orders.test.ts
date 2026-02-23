import request from 'supertest';
import app from '../index';

jest.mock('../db/client', () => ({
    query: jest.fn(),
    pool: {
        connect: jest.fn().mockResolvedValue({
            query: jest.fn(),
            release: jest.fn(),
        }),
        end: jest.fn(),
    },
}));

import { pool } from '../db/client';
const mockPool = pool as jest.Mocked<typeof pool>;

describe('Orders API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('POST /api/orders validates required fields', async () => {
        const res = await request(app).post('/api/orders').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validation failed');
    });

    it('POST /api/orders returns 400 for fully-booked slot', async () => {
        const mockClient = {
            query: jest.fn()
                .mockResolvedValueOnce(undefined) // BEGIN
                .mockResolvedValueOnce({ rows: [{ capacity: 10, booked_count: 10 }] }) // slot check
                .mockResolvedValueOnce(undefined), // ROLLBACK
            release: jest.fn(),
        };
        mockPool.connect.mockResolvedValueOnce(mockClient as unknown as ReturnType<typeof pool.connect> extends Promise<infer T> ? T : never);
        const res = await request(app).post('/api/orders').send({
            customer_name: 'ישראל ישראלי',
            customer_phone: '052-0000000',
            pickup_slot_id: '00000000-0000-0000-0000-000000000001',
            items: [{ product_id: '00000000-0000-0000-0000-000000000002', quantity: 1 }],
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/fully booked/i);
    });

    it('GET /api/orders returns 401 without auth', async () => {
        const res = await request(app).get('/api/orders');
        expect(res.status).toBe(401);
    });

    it('PATCH /api/orders/:id/status rejects invalid status', async () => {
        const res = await request(app)
            .patch('/api/orders/00000000-0000-0000-0000-000000000001/status')
            .set('Authorization', 'Bearer invalid_token')
            .send({ status: 'flying' });
        expect(res.status).toBe(401); // token invalid
    });
});
