import request from 'supertest';
import app from '../index';

// Mock the DB client
jest.mock('../db/client', () => ({
    query: jest.fn(),
    pool: { connect: jest.fn(), end: jest.fn() },
}));

import { query } from '../db/client';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('Products API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /api/products returns product list', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { id: '123', name_he: 'אנטריקוט', name_en: 'Ribeye', price_nis: 189, is_available: true },
            ],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
        });
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name_he).toBe('אנטריקוט');
    });

    it('GET /api/products?available=true filters unavailable', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'SELECT', oid: 0, fields: [] });
        const res = await request(app).get('/api/products?available=true');
        expect(res.status).toBe(200);
        expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('is_available = true'), expect.anything());
    });

    it('GET /api/products/:id 404 when not found', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'SELECT', oid: 0, fields: [] });
        const res = await request(app).get('/api/products/00000000-0000-0000-0000-000000000000');
        expect(res.status).toBe(404);
    });

    it('POST /api/products returns 401 without auth', async () => {
        const res = await request(app).post('/api/products').send({ name_he: 'test' });
        expect(res.status).toBe(401);
    });
});
