'use client'

import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { LoginForm } from './loginform';

interface AuthContextType {
    session: Session | null;
    loading: boolean; 
    
}

interface AuthProviderProps {
    children: React.ReactNode
    onSignIn: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children}) => {
    const [session, setSesion] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 

    useEffect(() => {
        const {data: authListener} = supabase.auth.onAuthStateChange((_, session) => {
            setSesion(session); 
            setLoading(false);
        });

        if(session) {
            router.push('/');
        } 
        return () => authListener?.subscription.unsubscribe();
    }, [router, session]);

     // Render the LoginForm if not loading and there's no session
     if (loading) {
        return <div className='flex justify-center items-center'>Loading...</div>; // Optional: You can show a loading spinner here
    }

    if (!session) {
        return <LoginForm />; // Render LoginForm when there's no session
    }

    return (
        <AuthContext.Provider value={{session, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);