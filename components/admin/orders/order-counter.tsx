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
                if(data?.orders) {
                    setCount(data.orders.length);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
    
        fetchOrders();
    
        const channel = supabase.channel('orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
                filter: 'status=eq.not_started'
            }, (payload) => {
                if (payload.eventType === 'INSERT' && payload.new.status === 'not_started') {
                    setCount(prev => prev + 1);
                }
                else if (payload.eventType === 'UPDATE') {
                    // If status changed TO not_started and not completed
                    if (payload.new.status === 'not_started' && !payload.new.completed && payload.old.status !== 'not_started') {
                        setCount(prev => prev + 1);
                    }
                    // If status changed FROM not_started OR order is completed
                    else if (
                        (payload.old.status === 'not_started' && payload.new.status !== 'not_started') ||
                        payload.new.completed === true
                    ) {
                        setCount(prev => prev - 1);
                    }
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