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
import Loading from "./loading";

type AdminDashboardProps = {
    children: ReactNode
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({children}) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        const getSession = async () => {
            try {
                const {data: {session}} = await supabase.auth.getSession()
                setSession(session);
                setIsLoading(false)
                //console.log(session);
            } catch(error) {
                console.log('Failed to get session', error);
            } 
        }
        getSession();
                
        if(session) {
            router.push('/');
        }
    }, [])

    if(isLoading) {
        return <Loading />
    }

    return (
        !session ? (
            <LoginForm />
        ): (
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
    )
}

export default AdminDashboard;