import { Customer } from "./customer";

export enum OrderType {
    PICKUP = 'pickup',
    DELIVERY = 'delivery'
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    READY = 'ready',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NOT_STARTED = 'not_started',
  }

export interface Order {
    id?: string;
    short_id?: string;
    customer: Customer;
    status: OrderStatus;
    order_type: OrderType;
    delivery_service?: string;
    pickup_date: string;
    pickup_time: string;
    prep_time_minutes?: number;
    staff_notes?: string;
    total: number;
    sub_total: number;
    service_fee: number;
    items: OrderItem[];
    payments?: OrderPayment[];
    status_history?: OrderStatusHistory[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    quantity: number;
    price: number;
    item_id: number;
    item_name: string;
    special_instructions?: string;
    modifiers?: OrderItemModifier[];
}
  
export interface OrderItemModifier {
    id: string;
    name: string;
    options: OrderItemModifierOption[];
}

export interface OrderItemModifierOption {
    id: string;
    name: string;
    price: number;
  }
  
  interface OrderPayment {
    id: string;
    paymentIntentId: string;
    status: PaymentStatus;
    method: PaymentMethod;
    amount: number;
  }
  
export enum PaymentStatus {
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export enum PaymentMethod {
    CARD = 'card',
}

export interface OrderStatusHistory {
    id: string;
    status: OrderStatus;
    notes?: string;
    staffId?: string;
    createdAt: string;
  }