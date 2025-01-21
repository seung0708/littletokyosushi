'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface AuthContextType {
    user: User | null; 
    isLoading: boolean;
    signin: (email: string, password: string) => Promise<void>;
    setUser: (user: User | null) => void;
    signout: () => Promise<void>;
    googleSignin: () => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    signinAnonymously: (email: string, password: string) => Promise<void>;
    resetPassword: (password: string, token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}, error}  = await supabase.auth.getUser();
            //console.log(user, error);
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setIsLoading(false);
      
            const {data: {subscription}} = await supabase.auth.onAuthStateChange(async (_event, session) => {
                setUser(session?.user ?? null);
                setIsLoading(false);
            })

            return () => subscription.unsubscribe();
        }
        fetchUser();
    }, []); 

    const signup = async (email: string, password: string) => {
        try {
           const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if(data.user) {
                setUser(data.user);
            }
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign up');
            }
            return data;
        } catch (error) {
            console.error('Eror signing up:', error);
        }
    };
    
    const signin = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
           
            if (!response.ok) {
                throw new Error('Failed to sign in');
            }
            const data = await response.json();
            console.log(data);
            if(data.user) {
                setUser(data.user);
                return data.user
            }
            return data;
        } catch (error) {
            console.error('Eror signing in:', error);
        }
    };

    const googleSignin = async () => {
        try {
            const response = await fetch('/api/auth/oauth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to sign in with Google');
            } 
            localStorage.setItem('wasLoggedIn', 'true');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const signout = async () => {
        try {
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign out');
            }
            setUser(null);
            localStorage.removeItem('cartId');
            localStorage.removeItem('cartItems');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };  

    const signinAnonymously = async (email: string, name: string) => {
        try {
            const response = await fetch('/api/auth/signin-anonymously', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name }),
                credentials: 'include',
            });
            const data = await response.json();
            setUser(data.user); 

            return data; 
        } catch (error) {
            console.error('Error signing in anonymously:', error);
            throw error; 
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
        <AuthContext.Provider value={{user, isLoading, signin, signout, googleSignin, resetPassword, signup, signinAnonymously, setUser}}>
            {children}
        </AuthContext.Provider>
    )

    
}
