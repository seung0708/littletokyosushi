'use client';

import {useEffect, useState} from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';

export default function OrderCounter() {
    const [count, setCount] = useState(0);
    const supabase = createClient(); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/admin/orders?not_started=true');
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                setCount(data.orders.length);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        // Initial fetch
        fetchOrders();

        // Subscribe to order changes
        const channel = supabase.channel('orders')
            .on('postgres_changes', {
                event: '*',  // Listen to all events (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'orders'
            }, (payload) => {
                // Only refetch if the change involves not_started status
                if (payload.eventType === 'INSERT' && payload.new.status === 'not_started') {
                    fetchOrders();
                } else if (payload.eventType === 'UPDATE' && 
                    (payload.new.status === 'not_started' || payload.old.status === 'not_started')) {
                    fetchOrders();
                }
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return count > 0 ? (
        <Badge variant="destructive" className="ml-auto">
            {count}
        </Badge>
    ) : null;
}