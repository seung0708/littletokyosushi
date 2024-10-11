import {ReactNode} from 'react';
import Header from './components/header';

export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <>
        <Header />
        <main>{children}</main>
        </>
    )
}