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

        // Subscribe to all order changes
        const channel = supabase.channel('orders')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'orders',
                filter: 'status=eq.not_started'
            }, () => {
                fetchOrders();
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: 'status=eq.not_started'
            }, () => {
                fetchOrders();
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: 'old_status=eq.not_started'
            }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return count > 0 ? (
        <Badge variant="destructive" className="ml-auto">
            {count}
        </Badge>
    ) : null;
}