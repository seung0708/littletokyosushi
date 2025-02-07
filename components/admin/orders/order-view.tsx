'use client';

import { useState, useEffect } from 'react';
import OrderDetails from './order-details';
import OrderFooter from './order-footer';
import RefundSection from './refund-section';
import { createClient } from '@/lib/supabase/client';
import { Order } from '@/types/order';

interface OrderViewProps {
    orderId: Order['id'];
    onRefund: (values: any) => void;
}

const OrderView: React.FC<OrderViewProps> = ({ orderId, onRefund }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        customer:customers(*),
                        order_items(
                            *,
                            menu_item:items(*),
                            order_item_modifiers(
                                *,
                                order_item_modifier_options(*)
                            )
                        )
                    `)
                    .eq('id', orderId)
                    .single();

                if (orderError) throw orderError;
                setOrder(orderData);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch order');
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId, supabase]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">
                    {error || 'Order not found'}
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