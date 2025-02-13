"use client"

import OrdersContainer from "./orders-container";

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types/order';
import Pagination from '@/components/admin/pagination';

export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]) 
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const supabase = createClient()
  
  const fetchArchivedOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders?completed=true&page=${currentPage}`)
      
      const data = await response.json()
      console.log(data)
      if(data) {
        setOrders(data.orders)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedOrders()

    const channel = supabase
      .channel('archived-orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: 'completed=eq.true'
      }, () => {
        fetchArchivedOrders()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])


  return (
    <OrdersContainer
      title="Order History"
      orders={orders}
      loading={loading}
    >
      <Pagination totalPages={totalPages} />
    </OrdersContainer>
  )
}