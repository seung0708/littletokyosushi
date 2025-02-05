// app/(admin)/orders/[orderId]/page.tsx
'use client'
import { useState, useEffect, use } from 'react'
import AdminLoading from "@/app/(admin)/loading";
import OrderView from "@/components/admin/orders/order-view";
import RecentOrder from "@/components/admin/orders/recent-order";

const OrderPage = ({ params }: { params: { orderId: string } }) => {
    const [order, setOrder] = useState()

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/admin/orders/${params.orderId}`)
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                const order = await response.json()
                setOrder(order)
            } catch (error) {
                console.error('Error fetching order:', error)
            }
        }

        fetchOrder()
    }, [params.orderId])

    const onRefund = async (values: any) => {
        try {
            const response = await fetch(`/api/admin/orders/${order?.short_id}/refunds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to process refund');
            }
        } catch (error) {
            console.error('Error processing refund:', error);
        }
    };

    if (!order) return <AdminLoading />
  
    return (
        <div>
            {order.archived ? (
                <OrderView order={order} onRefund={onRefund} />
            ) : (
                <RecentOrder order={order} />
            )}
        </div>
    )
}

export default OrderPage