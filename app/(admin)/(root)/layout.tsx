import { ReactNode } from 'react';
import Sidebar from "../ui/sidebar";
import Header from "../ui/header";

export default function AdminLayout({children}: { children: ReactNode }) {
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