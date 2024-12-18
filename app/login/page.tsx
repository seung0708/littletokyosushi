'use client';
import AdminLogin from "@/components/auth/adminLogin";
import CustomerLogin from "@/components/auth/customerLogin";

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
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
                <AdminLogin />
                </div>
            ) : (
                <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                </div>
                <CustomerLogin/>
                
            </div>
            )}
        </div>
    );
}