'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";

export default function CallbackPage() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const {error} = await supabase.auth.exchangeCodeForSession(window.location.href);
            if(!error) {
                router.replace('/checkout');
            }
        }
        handleAuthCallback();
    }, [router])

    return <div>Processing authentication...</div>

}