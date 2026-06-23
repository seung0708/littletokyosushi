type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending:    ['confirmed', 'cancelled'],
    confirmed:  ['preparing', 'cancelled'],
    preparing:  ['ready'],
    ready:      ['completed'],
    completed:  [],
    cancelled:  [],
};

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
    return validTransitions[from]?.includes(to) ?? false;
}