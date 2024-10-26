'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '../login/page';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null to indicate loading
    const router = useRouter();

    const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    };

    const signIn = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        router.push('/'); // Redirect to home or dashboard after sign-in
    };

    const signOut = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/login'); // Redirect to login page after sign-out
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/login'); // Redirect if not authenticated
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Show loading indicator while checking authentication
    }

    return (
        <>
            {isAuthenticated ? (
                children
            ) : (
                <LoginPage onSignIn={signIn} />
            )}
        </>
    );
};


export default AuthProvider;
