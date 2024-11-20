import Sidebar from "./ui/sidebar";
import Header from "./ui/header";
import { ReactNode } from "react";


type AdminDashboardProps = {
    children: ReactNode
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({children}) => {
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