"use client"

import Link from 'next/link'

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {Card, CardContent, CardHeader,CardTitle} from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types/order';

export default function OrdersList() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio('/sounds/mixkit-confirmation-tone-2867.wav');
    const fetchOrders = async () => {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      setOrders(data)
    }
    fetchOrders()

    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      }, async (payload) => {  // Add async here
        console.log('Received payload:', payload);
        const { data: newOrder } = await supabase  // Add await here
          .from('orders')
          .select(`
            *,
            customers(*),
            order_items(*,
              menu_items(*), 
              order_item_modifiers(*,
                modifiers(*),
                order_item_modifier_options(*)
              )
            )
          `)
          .eq('id', payload.new.id)
          .single();
          
          
        if (newOrder) {
          setOrders((prevOrders) => [newOrder, ...prevOrders]);  // Add to beginning of list
          audioRef.current?.play();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
      }, async (payload) => {
        console.log('Received UPDATE payload:', payload);
        const { data: updatedOrder } = await supabase
          .from('orders')
          .select(`
            *,
            customers(*),
            order_items(*,
              menu_items(*), 
              order_item_modifiers(*,
                modifiers(*),
                order_item_modifier_options(*)
              )
            )
          `)
          .eq('id', payload.new.id)
          .single();
          
        if (updatedOrder) {
          setOrders((prevOrders) => 
            prevOrders.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            )
          );
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'orders',
      }, async (payload) => {
        console.log('Received DELETE payload:', payload);
        // Remove the deleted order from the state
        setOrders((prevOrders) => 
          prevOrders.filter(order => order.id !== payload.old.id)
        );
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [])

    return (
        <>
        <Tabs defaultValue="week">
        {/* <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-sm"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Fulfilled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Declined
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Refunded
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-sm"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div> */}
        <TabsContent value="week">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Type
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Fulfillment Date
                    </TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order) => (
                    <TableRow key={order.id} className="bg-accent">
                      {/* Each cell becomes a link */}
                      <TableCell>
                        <Link href={`/orders/${order.short_id}/edit`} className="block hover:opacity-80">
                          <div className="font-medium">
                            {order.customers.first_name} {order.customers.last_name}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.customers.email}
                          </div>
                        </Link>
                      </TableCell>  
                      <TableCell className="hidden sm:table-cell">
                        <Link href={`/orders/${order.short_id}/edit`} className="block hover:opacity-80">
                          {order.order_type.toUpperCase()}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Link href={`/orders/${order.short_id}/edit`} className="block hover:opacity-80">
                          <Badge className="text-xs" variant="secondary">
                            {order.status.toUpperCase().split('_').join(' ')}
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Link href={`/orders/${order.short_id}/edit`} className="block hover:opacity-80">
                          {order.order_type === 'pickup' && order.pickup_date && (
                            <>
                              {format(new Date(order.pickup_date), 'EEEE, MMMM d, yyyy')}{' '}
                              {order.pickup_time && (
                                <>
                                  {(() => {
                                    const [hours, minutes] = order.pickup_time.split(':');
                                    const date = new Date();
                                    date.setHours(parseInt(hours, 10));
                                    date.setMinutes(parseInt(minutes, 10));
                                    return format(date, 'h:mm a');
                                  })()}
                                </>
                              )}
                            </>
                          )}
                          {order.order_type === 'delivery' && order.delivery_date && (
                            <>
                              {format(new Date(order.delivery_date), 'EEEE, MMMM d, yyyy')}{' '}
                              {order.delivery_time && (
                                <>
                                  {(() => {
                                    const [hours, minutes] = order.delivery_time.split(':');
                                    const date = new Date();
                                    date.setHours(parseInt(hours, 10));
                                    date.setMinutes(parseInt(minutes, 10));
                                    return format(date, 'h:mm a');
                                  })()}
                                </>
                              )}
                            </>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/orders/${order.short_id}/edit`} className="block hover:opacity-80">
                          ${order.total}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </>
    )
}