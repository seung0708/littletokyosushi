"use client"

import OrdersContainer from "./orders-container";
import { useState, useEffect, useRef } from "react"
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types/order';
import { Switch } from "@/components/ui/switch"

export default function OrdersList() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)

  useEffect(() => {
    // Preload audio
    audioRef.current = new Audio('/sounds/mixkit-confirmation-tone-2867.wav')
    audioRef.current.volume = 1.0  // Set to maximum volume
    audioRef.current.load()
  }, [])

  const playNotificationSound = () => {
    if (audioRef.current && audioEnabled) {
      audioRef.current.currentTime = 0  // Reset to start
      audioRef.current.volume = 1.0     // Ensure maximum volume on each play
      audioRef.current.play()
    }
  }

  const addOrder = (newOrder: Order) => {
    setOrders(prevOrders => {
      if (!prevOrders) return [newOrder]
      return [newOrder, ...prevOrders]
    })
  }

  const removeOrder = (orderId: string) => {
    setOrders(prevOrders => {
      if (!prevOrders) return []
      return prevOrders.filter(order => order.id !== orderId)
    })
  }

  useEffect(() => {  
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/orders?not_started=true')
        const data = await response.json()
        if (data?.orders) {
          setOrders(data.orders)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
      setLoading(false)
    }

    fetchOrders()

    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: 'status=eq.not_started'
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
          .eq('archived', false)
          .single();

        if (newOrder) {
          addOrder(newOrder);
          playNotificationSound();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: 'status=eq.not_started'
      }, async (payload) => {
        // If status changed TO not_started and not archived
        if (payload.new.status === 'not_started' && !payload.new.archived && payload.old.status !== 'not_started') {
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
            .eq('archived', false)
            .single();
          
          if (newOrder) {
            addOrder(newOrder);
            playNotificationSound();
          }
        }
        // If status changed FROM not_started OR order is archived
        else if (
          (payload.old.status === 'not_started' && payload.new.status !== 'not_started') ||
          payload.new.archived === true
        ) {
          removeOrder(payload.old.id);
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'orders',
        filter: 'status=eq.not_started'
      }, (payload) => {
        removeOrder(payload.old.id);
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <OrdersContainer
      title="Active Orders"
      orders={orders || []}
      loading={loading}
      audioControl={
        <Switch
          checked={audioEnabled}
          onCheckedChange={setAudioEnabled}
          aria-label="Toggle notification sound"
        />
      }
    />
  )
}