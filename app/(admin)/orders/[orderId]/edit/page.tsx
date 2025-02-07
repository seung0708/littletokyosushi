'use client'
import RecentOrder from "@/components/admin/orders/recent-order";

import {useState, useEffect} from 'react'
import AdminLoading from "../../../loading";

const OrderPage = ({ params }: { params: { orderId: string } }) => {
    const {orderId} = params
    const [order, setOrder] = useState()

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
}, [])

  if (!order) return <AdminLoading />
  
    return (
        <div>
            <RecentOrder order={order} />
        </div>
    )
}

export default OrderPage