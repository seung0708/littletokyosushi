import { ReactNode } from 'react';
import {AuthProvider} from './ui/auth/authprovider';
import AdminDashboard from './page';

export default function AdminLayout({children}: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AdminDashboard children={children} />
        </AuthProvider>
    )
}