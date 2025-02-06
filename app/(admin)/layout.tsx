import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({children}: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    
    if (!user) {
        redirect('http://admin.localhost:3000/signin');
    } 
    
    return (
        <div className='flex min-h-screen'>
            <Sidebar />
            <main className='flex-1 flex flex-col'>
                <Header />
                <div className='flex-1 p-6 bg-gray-50'>{children}</div>
            </main>
        </div>
    )
}