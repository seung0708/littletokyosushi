"use client"

import OrdersContainer from "./orders-container";

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types/order';
import Pagination from '@/components/admin/pagination';
import { useSearchParams } from 'next/navigation';
export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]) 
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const supabase = createClient()
  
  const fetchArchivedOrders = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders?completed=true&page=${page}`)
      const data = await response.json()
      
      if(data?.orders) {
        setOrders(data.orders)
        setTotalPages(data.totalPages)
      } else {
        setOrders([])
        setTotalPages(0)
      }
    } catch (error) {
        console.error('Error:', error)
        setOrders([])
        setTotalPages(0)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedOrders(currentPage)
  }, [currentPage]) // Re-fetch when URL page param changes

  useEffect(() => {
    const channel = supabase
      .channel('archived-orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: 'completed=eq.true'
      }, async (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new.completed === true) {
          // Refetch to get the latest order list with the new completed order
          fetchArchivedOrders(currentPage);
        }
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [currentPage])

  return (
    <OrdersContainer
      title="Order History"
      orders={orders || []}
      loading={loading}
    >
      <Pagination totalPages={totalPages} />
    </OrdersContainer>
  )
}