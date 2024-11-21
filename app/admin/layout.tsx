import { ReactNode } from 'react';
import AdminDashboard from './page';

export default function AdminLayout({children}: { children: ReactNode }) {
    return (
        <AdminDashboard children={children} />
    )
}