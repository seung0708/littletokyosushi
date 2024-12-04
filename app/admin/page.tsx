import Sidebar from "./ui/sidebar";
import Header from "./ui/header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


const AdminDashboard = async ({children}: {children: React.ReactNode}) => {
    const supabase = createClient() ;
    const {data: {user}} = await supabase.auth.getUser(); 
    console.log(user)
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