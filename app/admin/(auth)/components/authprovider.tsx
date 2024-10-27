'use client'

import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    loading: boolean; 
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: React.ReactNode }) => {
    const [session, setSesion] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 
    const pathName = usePathname();

    useEffect(() => {
        const {data: authListener} = supabase.auth.onAuthStateChange((_, session) => {
            setSesion(session); 
            setLoading(false);
        });

        if(session && pathName === '/login') {
            router.push('/');
        }
        return () => authListener?.subscription.unsubscribe();
    }, [router, session]);

    return (
        <AuthContext.Provider value={{session, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);