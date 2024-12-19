'use client';
import AdminSignin from "@/components/auth/adminSignin";
import CustomerSignin from "@/components/auth/customerSignin";

import { useEffect, useState } from "react";

export default function LoginPage() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(window.location.host.startsWith('admin.'))
    }, [])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {isAdmin ? (
                <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Sign in</h2>
                <AdminSignin />
                </div>
            ) : (
                <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <CustomerSignin/>
                
            </div>
            )}
        </div>
    );
}