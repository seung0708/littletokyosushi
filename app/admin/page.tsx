'use client';

import Sidebar from "./ui/sidebar";
import Header from "./ui/header";
import { ReactNode } from "react";
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LoginForm } from "./ui/auth/loginform";


type AdminDashboardProps = {
    children: ReactNode
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({children}) => {
    const [session, setSession] = useState<Session | null>(null)
    const router = useRouter()

    useEffect(() => {
        const {data: authListener} = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session)
        });
        if(session) {
            router.push('/');
        } 
        return () => authListener?.subscription.unsubscribe();

    }, [])

    if(!session) {
        router.push('/');
        return <LoginForm />
    }

    return (
        <div>
            <div className='flex min-h-screen'>
            <Sidebar />
            <main className='flex-1 flex flex-col'>
                <Header />
                <div className='flex-1 p-6 bg-gray-50'>{children}</div>
            </main>
        </div>
        </div>
    )
}

export default AdminDashboard;