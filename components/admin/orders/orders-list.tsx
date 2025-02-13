"use client"

import OrdersContainer from "./orders-container";

import { useState, useEffect, useRef } from "react"
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types/order';


export default function OrdersList() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    audioRef.current = new Audio('/sounds/mixkit-confirmation-tone-2867.wav');
    const fetchOrders = async () => {
      setLoading(true)
      const response = await fetch('/api/admin/orders?not_started=true')
      const data = await response.json()
      setOrders(data.orders)
      setLoading(false)
    }
    fetchOrders()

    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      }, async (payload) => { 
        const { data: newOrder } = await supabase 
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
          setOrders((prevOrders) => [newOrder, ...prevOrders]);
          audioRef.current?.play();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
      }, async (payload) => {
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
        <OrdersContainer 
          title="Orders" 
          orders={orders} 
          loading={loading} 
        />
    )
}