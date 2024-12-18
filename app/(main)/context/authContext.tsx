'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useCart } from './cartContext';
import { createClient } from '@/lib/supabase/client';
import { error } from 'console';
import { redirect } from 'next/navigation';

interface AuthContextType {
    user: User | null; 
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    googleLogin: () => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    resetPassword: (password: string, token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const {cartId} = useCart();


    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}, error}  = await supabase.auth.getUser();
            setUser(user ?? null);
            setIsLoading(false);

            const {data: {subscription}} = await supabase.auth.onAuthStateChange(async (_event, session) => {
                setUser(user ?? null);
                setIsLoading(false);
            })

            return () => subscription.unsubscribe();
        }
        fetchUser();
    }, []);

    const handleCartMerge = async (userId: string) => {
        if(cartId) {
            await fetch(`/api/main/cart/merge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ guestCartId: cartId, userId }),
            });
        }
    }

    const signup = async (email: string, password: string) => {
        try {
           const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const {data: {user}, error} = await response.json();
            if (!response.ok) {
                throw new Error(error || 'Failed to sign up');
            }
            if(user) {
                await handleCartMerge(user.id);
            }
        } catch (error) {
            console.error('Eror signing up:', error);
        }
    };
    
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const {data: {user}, error} = await response.json();
            if (!response.ok) {
                throw new Error(error || 'Failed to sign in');
            }
            if(user) {
                await handleCartMerge(user.id);
            }
        } catch (error) {
            console.error('Eror signing in:', error);
        }
    };

    const googleLogin = async () => {
        try {
            const response = await fetch('/api/auth/oauth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const {data: {user}, error} = await response.json();
            if (!response.ok) {
                throw new Error(error || 'Failed to sign in');
            }
            if(user) {
                await handleCartMerge(user.id);
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const {data: {user}, error} = await response.json();
            if (!response.ok) {
                throw new Error(error || 'Failed to sign out');
            }
            if(user) {
                await handleCartMerge(user.id);
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };  

    const resetPassword = async (newPassword: string) => {
        try {
            const response = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });
            const {data: {user}, error} = await response.json();
            if (!response.ok) {
                throw new Error(error || 'Failed to update password');
            } 
            redirect('/login');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (    
        <AuthContext.Provider value={{user, isLoading, login, logout, googleLogin, resetPassword, signup}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}