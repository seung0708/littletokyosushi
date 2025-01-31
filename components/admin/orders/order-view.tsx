'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/types/database.types';
import OrderDetails from './order-details';
import OrderFooter from './order-footer';
import RefundSection from './refund-section';
import { createClient } from '@/lib/supabase/client';

type Order = Database['public']['Tables']['orders']['Row'] & {
    customer: Database['public']['Tables']['customers']['Row'];
    order_items: Array<
        Database['public']['Tables']['order_items']['Row'] & {
            menu_item: Database['public']['Tables']['items']['Row'];
            order_item_modifiers: Array<
                Database['public']['Tables']['order_item_modifiers']['Row'] & {
                    order_item_modifier_options: Array<
                        Database['public']['Tables']['order_item_modifier_options']['Row']
                    >;
                }
            >;
        }
    >;
};

interface OrderViewProps {
    orderId: string;
}

const OrderView: React.FC<OrderViewProps> = ({ orderId }) => {
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
                <OrderDetails order={order} />
                <RefundSection order={order} />
                <OrderFooter order={order} />
            </div>
        </div>
    );
};

export default OrderView;