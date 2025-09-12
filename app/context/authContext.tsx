'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { redirect } from 'next/navigation';

interface AuthContextType {
    user: User | null; 
    isLoading: boolean;
    signin: (email: string, password: string) => Promise<User | null>;
    setUser: (user: User | null) => void;
    signout: () => Promise<void>;
    googleSignin: () => Promise<void>;
    signup: (email: string, password: string) => Promise<User | null>;
    signinAnonymously: (email: string, password: string) => Promise<User | null>;
    resetPassword: (password: string, token: string) => Promise<void>;
    waitForUser: () => Promise<User>;
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
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/user');
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

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
            
            const data = await response.json();
            
            if (!response.ok) {
                return { error: data.error || 'Failed to sign in' };
            }
            
            if(data.user) {
                setUser(data.user);
                return data.user;
            }
            return data;
        } catch (error) {
            console.error('Error signing in:', error);
            return { error: 'An unexpected error occurred' };
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
            if (response.redirected) {
                window.location.href = response.url;
            }
            const data = await response.json();
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
            const { error} = await response.json();
            if (!response.ok) {
                throw new Error(error || 'Failed to update password');
            } 
            redirect('/login');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    const waitForUser = () => {
        return new Promise<User>((resolve, reject) => {
            if (user) {
                resolve(user);
                return;
            }

            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (user) {
                    clearInterval(interval);
                    resolve(user);
                } else if (attempts >= 10) { // 5 seconds max
                    clearInterval(interval);
                    reject(new Error('Timeout waiting for user'));
                }
            }, 500);
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            signin,
            setUser,
            signout,
            googleSignin,
            signup,
            signinAnonymously,
            resetPassword,
            waitForUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}
