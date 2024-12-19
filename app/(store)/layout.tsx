import {ReactNode} from 'react';
import Header from '../../components/store/header';
import { CartProvider } from '../context/cartContext';
import { AuthProvider } from '../context/authContext';

export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <CartProvider>
            <AuthProvider>
                <Header />
                <main>{children}</main>
            </AuthProvider>
        </CartProvider>
    )
}