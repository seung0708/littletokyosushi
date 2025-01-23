'use client'
import RecentOrder from "@/components/admin/orders/recent-order";

import {useState, useEffect} from 'react'

const OrderPage = ({ params }: { params: { orderId: string }}) => {
    const [order, setOrder] = useState()

  useEffect(() => {
  const fetchOrder = async () => {
    console.log('Fetching order:', params.orderId) // Add this
    try {
      const response = await fetch(`/api/admin/orders/${params.orderId}`)
      console.log('Response status:', response.status) // Add this
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const order = await response.json()
      console.log('Order data:', order) // Add this
      setOrder(order)
    } catch (error) {
      console.error('Error fetching order:', error)
    }
  }

  fetchOrder()
}, [params.orderId])
  
    return (
        <div>
            <RecentOrder order={order} />
        </div>
    )
}

export default OrderPage