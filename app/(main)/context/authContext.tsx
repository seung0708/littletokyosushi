'use client';
import { createClient } from '@/lib/supabase/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useCart } from './cartContext';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
 
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const { cartId } = useCart();
    
    const emailLogin = async (email: string, password: string) => {
        try {
            // Your existing sign in logic
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) throw error;

            // If we have a guest cart, merge it
            if (cartId) {
                await fetch('/api/main/cart/merge', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        guestCartId: cartId,
                        userId: user?.id
                    }),
                });
            }

            // Update auth state
            setUser(user);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    // ... rest of your auth context code ...

    return (
        <AuthContext.Provider value={{ user, handleSignIn, /* other values */ }}>
            {children}
        </AuthContext.Provider>
    );
};
