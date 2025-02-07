'use client';

import { useState, useEffect } from 'react';
import OrderDetails from './order-details';
import OrderFooter from './order-footer';
import RefundSection from './refund-section';
import { createClient } from '@/lib/supabase/client';
import { Order } from '@/types/order';

interface OrderViewProps {
    order: Order;
    onRefund: (values: { amount: number; reason: string }) => void;
}

const OrderView: React.FC<OrderViewProps> = ({ order, onRefund }) => {

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">
                    Order not found
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <OrderDetails order={order} onRefund={onRefund} />
                <RefundSection order={order} onRefund={onRefund} />
                <OrderFooter order={order} />
            </div>
        </div>
    );
};

export default OrderView;