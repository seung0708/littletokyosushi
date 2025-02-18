'use client'
import RecentOrder from "@/components/admin/orders/recent-order";

import {useState, useEffect, use} from 'react'
import AdminLoading from "../../../loading";
import { Order} from '@/types/order';

const OrderPage = ({ params }: { params: Promise<{ orderId: string }> }) => {
    const { orderId } = use(params)
    const [order, setOrder] = useState<Order>()

    useEffect(() => {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/admin/orders/${orderId}`)
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
          const order = await response.json()
          setOrder(order)
        } catch (error) {
          console.error('Error fetching order:', error)
        }
      }

      fetchOrder()
    }, [orderId])

    if (!order) return <AdminLoading />
  
    return (
        <div>
            <RecentOrder order={order} />
        </div>
    )
}

export default OrderPage