import { ReactNode } from 'react';
import AuthProvider from './components/auth/authprovider';
import AdminDashboard from './page';

export default function AdminLayout({children}: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AdminDashboard children={children} />
        </AuthProvider>
    )
}