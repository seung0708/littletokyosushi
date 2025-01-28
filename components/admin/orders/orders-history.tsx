// components/admin/orders/orders-history.tsx
"use client"

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/client'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Order {
  id: string
  short_id: string
  status: string
  total: number
  completed_at: string
  updated_at: string
  archived: boolean
  customers?: {
    name: string
  }
  order_items?: Array<{
    id: string
    menu_items: any
  }>
}

export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]) // Initialize as empty array
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchArchivedOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers(*),
          order_items(
            *,
            menu_items(*)
          )
        `)
        .eq('archived', true)
        .order('completed_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Ensure data is an array
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching archived orders:', error)
      setOrders([]) // Set to empty array on error
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
        filter: 'archived=eq.true'
      }, () => {
        fetchArchivedOrders()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  // Only filter if orders is an array
  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const searchLower = searchQuery.toLowerCase()
    return (
      order.short_id.toLowerCase().includes(searchLower) ||
      (order.customers?.name || '').toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    )
  }) : []

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'refunded':
        return 'destructive'
      case 'completed':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order History</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No archived orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.short_id}</TableCell>
                    <TableCell>{order.customers?.name || 'Anonymous'}</TableCell>
                    <TableCell>{order.order_items?.length || 0} items</TableCell>
                    <TableCell>{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.completed_at || order.updated_at), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${order.short_id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}