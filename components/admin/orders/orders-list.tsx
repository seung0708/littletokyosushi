"use client"

import OrdersContainer from "./orders-container";
import { useState, useEffect, useRef } from "react"
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types/order';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"


export default function OrdersList() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    audioRef.current = new Audio('/sounds/mixkit-confirmation-tone-2867.wav');
    // Try to play muted first to handle autoplay restriction
    if (audioRef.current) {
      audioRef.current.muted = true;
      audioRef.current.play().catch(() => {});
    }
    
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
          if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.play().catch((error) => {
              console.log('Audio play failed:', error);
            });
          }
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
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="space-y-4">
      <OrdersContainer title="All Orders" orders={orders} loading={loading} />
    </div>
  )
}