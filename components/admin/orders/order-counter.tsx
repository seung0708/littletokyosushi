'use client';

import {useEffect, useState} from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';

export default function OrderCounter() {
    const [count, setCount] = useState(0);
    const supabase = createClient(); 

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch('/api/admin/orders?not_started=true');
            const data = await response.json();
            setCount(data.orders.length);
        };
        fetchOrders();

        const channel = supabase.channel('orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
            }, async (payload) => {
                const response = await fetch('/api/admin/orders?not_started=true');
                const data = await response.json();
                setCount(data.length);
            }
        ).subscribe();

        return () => {
            channel.unsubscribe();
        };

    }, []);



    
    return (
        <Badge variant="destructive">{count}</Badge>
    )
}