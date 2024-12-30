'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

interface AuthContextType {
    user: User | null; 
    isLoading: boolean;
    signin: (email: string, password: string) => Promise<void>;
    signout: () => Promise<void>;
    googleSignin: () => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
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

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}, error}  = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                
            } else {
                setUser(null);
            }
            setIsLoading(false);
            //console.log(localStorage.getItem('user'));
            console.log(user);
            const {data: {subscription}} = await supabase.auth.onAuthStateChange(async (_event, session) => {
                setUser(user ?? null);
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
            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            
            if (!response.ok) {
                throw new Error(user.error || 'Failed to sign up');
            }
            redirect('/confirm');
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
            const data = await response.json();
            console.log(data);
            
            if (!response.ok) {
                throw new Error('Failed to sign in');
            }
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
            redirect('/');
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
            redirect('/');
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
        <AuthContext.Provider value={{user, isLoading, signin, signout, googleSignin, resetPassword, signup}}>
            {children}
        </AuthContext.Provider>
    )

    
}
