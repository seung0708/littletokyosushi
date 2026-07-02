/** @jest-environment node */

import {POST} from "@/app/api/orders/route";

const mockSingle = jest.fn();
const mockSelect = jest.fn(() => ({ single: mockSingle }));
const mockInsert = jest.fn(() => ({ select: mockSelect }));
const mockFrom = jest.fn(() => ({ insert: mockInsert }));

jest.mock("../../lib/supabase/server", () => ({
    createClient: jest.fn(() => ({
        from: mockFrom,
    })),
}));

const validBody = {
    customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
    },
    delivery: {
        medthod: 'pickup',
        pickupDate: "2026-06-30",

    },
    total: 21.00,
    cartItems: [{
         id: 'abc',
        quantity: 1,
        base_price: 19.00,
        total_price: 19.00,
        menu_items: { id: 'item-123' },
    }]
}

describe('POST /api/orders', () => {
    beforeEach(() => jest.clearAllMocks());

    it('creates an order with valid data', async () => {
        mockSingle
            .mockResolvedValueOnce({ data: { id: '123', short_id: 'abc123' }, error: null })
            .mockResolvedValueOnce({ data: { id: '123', order_items: [] }, error: null });
        mockSelect.mockReturnValue({ single: mockSingle });

        const req = new Request('http://localhost/api/orders', {
            method: 'POST',
            body: JSON.stringify(validBody),
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await POST(req);
        const body = await res.json();
        console.log(body);
        expect(res.status).toBe(200);
    });

    it('rejects an empty cart', async () => {
        const req = new Request('http://localhost/api/orders', {
            method: 'POST',
            body: JSON.stringify({ ...validBody, cartItems: [] }),
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    it('rejects missing customer email', async () => {
        const req = new Request('http://localhost/api/orders', {
            method: 'POST',
            body: JSON.stringify({ 
                ...validBody, 
                customer: { name: 'John', phone: '2135551234' } 
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
    });
});