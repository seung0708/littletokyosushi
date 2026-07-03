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