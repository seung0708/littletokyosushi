/** @jest-environment node */

import { POST } from "../../app/api/orders/route";

const mockSingle = jest.fn();
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockFrom = jest.fn();

jest.mock("../../lib/supabase/server", () => ({
    createClient: jest.fn(() => ({ from: mockFrom })),
}));

const validBody = {
    customer: { name: 'John Doe', email: 'john@example.com', phone: '2135551234' },
    delivery: { method: 'pickup', pickupDate: '2026-06-30', pickupTime: '12:00' },
    total: 21.00,
    fees: { subTotal: 19.00 },
    cartItems: [{
        id: 'abc',
        quantity: 1,
        base_price: 19.00,
        total_price: 19.00,
        menu_items: { id: 'item-123' },
    }]
};


describe('POST /api/orders', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockEq.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ insert: mockInsert, select: mockSelect });
    mockInsert.mockReturnValue({ select: mockSelect });

    // Call 1 — orders insert chain
    mockSelect.mockReturnValueOnce({ single: mockSingle, eq: mockEq });
    // Call 2 — order_items insert (awaited directly, no .single())
    mockSelect.mockResolvedValueOnce({ data: [{ id: 'item-123' }], error: null });
    // Call 3 — final orders select chain
    mockSelect.mockReturnValue({ single: mockSingle, eq: mockEq });

    mockSingle
        .mockResolvedValueOnce({ data: { id: '123', short_id: 'abc123' }, error: null })
        .mockResolvedValueOnce({ data: { id: '123', order_items: [] }, error: null });
    });

    it('creates an order with valid data', async () => {
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