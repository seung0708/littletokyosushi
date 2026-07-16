/** @jest-environment node */
import { PATCH } from '../../app/api/admin/orders/[orderId]/route'

const mockSingle = jest.fn()
const mockEq = jest.fn()
const mockSelect = jest.fn()
const mockUpdate = jest.fn()
const mockFrom = jest.fn()

jest.mock('../../lib/supabase/server', () => ({
    createClient: jest.fn(() => ({from: mockFrom}))
}))

jest.mock('../../lib/email-smtp', () => ({
    sendOrderCompletedEmail: jest.fn().mockResolvedValue({ success: true }),
    sendPrepTimeNotificationEmail: jest.fn().mockResolvedValue({ success: true }),
    sendOrderReadyNotificationEmail: jest.fn().mockResolvedValue({ success: true }),
}))

describe('PATCH /api/admin/orders/[orderId]', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockEq.mockReturnValue({ single: mockSingle, select: mockSelect });
        mockSelect.mockReturnValue({ single: mockSingle, eq: mockEq });
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({ select: mockSelect, update: mockUpdate });
    });

    it('updates status from pending to confirmed', async () => {
        mockSingle
            .mockResolvedValueOnce({ data: { id: '123', status: 'pending', customers: { email: 'john@example.com' } }, error: null })
            .mockResolvedValueOnce({ data: { id: '123', status: 'confirmed', customers: { email: 'john@example.com' } }, error: null });

        const req = new Request('http://localhost/api/admin/orders/abc123', {
            method: 'PATCH',
            body: JSON.stringify({ status: 'confirmed' }),
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await PATCH(req, { params: Promise.resolve({ orderId: 'abc123' }) });
        expect(res.status).toBe(200);
    });

    it('returns 404 if order is not found', async () => {
        mockSingle
            .mockResolvedValueOnce({ data: null, error: null });

        const req = new Request('http://localhost/api/admin/orders/bad-id', {
            method: 'PATCH',
            body: JSON.stringify({ status: 'confirmed' }),
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await PATCH(req, { params: Promise.resolve({ orderId: 'bad-id' }) });
        expect(res.status).toBe(404);
    });

    it('returns 400 for an invalid status transition', async () => {
        mockSingle
            .mockResolvedValueOnce({ data: { id: '123', status: 'completed', customers: null }, error: null });

        const req = new Request('http://localhost/api/admin/orders/abc123', {
            method: 'PATCH',
            body: JSON.stringify({ status: 'confirmed' }),
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await PATCH(req, { params: Promise.resolve({ orderId: 'abc123' }) });
        expect(res.status).toBe(400);
    });
});