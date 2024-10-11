import {ReactNode} from 'react';
import Header from './components/header';

export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <>
        <Header />
        <hr className="my-6 border-t-2 border-white" />
        <main>{children}</main>
        </>
    )
}