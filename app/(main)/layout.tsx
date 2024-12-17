import {ReactNode} from 'react';
import Header from './components/header';
import { CartProvider } from './context/cartContext';

export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <CartProvider>
            <Header />
            <main>{children}</main>
        </CartProvider>
    )
}