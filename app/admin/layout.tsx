import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";

export default async function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <div className='flex min-h-screen'>
            <Sidebar />
            <main className='flex-1 flex flex-col md:ml-64'>
                <Header />
                <div className='flex-1 p-6 bg-gray-50'>{children}</div>
            </main>
        </div>
    )
}