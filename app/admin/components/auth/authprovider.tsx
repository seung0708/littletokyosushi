'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '../../login/page';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const checkAuthentication = () => {
        // Example: Replace with your actual logic, e.g., token validation
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        checkAuthentication();
        if (!isAuthenticated) {
            router.push('/'); // Redirect to login page if not authenticated
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <LoginPage />; // Render nothing until authentication is checked
    }

    return <>{children}</>;
};

export default AuthProvider;
