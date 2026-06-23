import { isValidTransition } from '@/utils/orderState';

describe('Order State Machine', () => {
    describe('valid transitions', () => {
        it('pending → confirmed', () => expect(isValidTransition('pending', 'confirmed')).toBe(true));
        it('confirmed → preparing', () => expect(isValidTransition('confirmed', 'preparing')).toBe(true));
        it('preparing → ready', () => expect(isValidTransition('preparing', 'ready')).toBe(true));
        it('ready → completed', () => expect(isValidTransition('ready', 'completed')).toBe(true));
        it('pending → cancelled', () => expect(isValidTransition('pending', 'cancelled')).toBe(true));
        it('confirmed → cancelled', () => expect(isValidTransition('confirmed', 'cancelled')).toBe(true));
    });

    describe('invalid transitions', () => {
        it('completed → anything', () => expect(isValidTransition('completed', 'pending')).toBe(false));
        it('preparing → pending', () => expect(isValidTransition('preparing', 'pending')).toBe(false));
        it('ready → confirmed', () => expect(isValidTransition('ready', 'confirmed')).toBe(false));
        it('cancelled → preparing', () => expect(isValidTransition('cancelled', 'preparing')).toBe(false));
    });
});