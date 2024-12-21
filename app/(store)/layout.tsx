import {ReactNode} from 'react';
import Header from '../../components/store/header';
import { CartProvider } from '@/app/context/cartContext';
import { AuthProvider } from '@/app/context/authContext';

export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <AuthProvider>
            <CartProvider>
                <Header />
                <main>{children}</main>
            </CartProvider>
        </AuthProvider>
    )
}