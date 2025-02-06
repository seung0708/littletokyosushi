// components/admin/orders/orders-history.tsx
"use client"

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/client'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Database } from '@/types/database.types';

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

export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]) 
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchArchivedOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders?archived=true`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
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
      order.id.toLowerCase().includes(searchLower) ||
      (order.customer?.name || '').toLowerCase().includes(searchLower) ||
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
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No archived orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.short_id}>
                    <TableCell className="font-medium">{order.short_id.toUpperCase()}</TableCell>
                    <TableCell>
                      {order.customers.first_name + ' ' + order.customers.last_name || 'Anonymous'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'processing' ? 'destructive' :
                          'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.created_at && formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Link  href={`/orders/${order.id}`}>
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