import { ReactNode } from 'react';
import {AuthProvider} from './auth/components/authprovider';
import AdminDashboard from './page';

export default function AdminLayout({children}: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AdminDashboard children={children} />
        </AuthProvider>
    )
}