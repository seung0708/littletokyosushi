import {ReactNode} from 'react';
import Header from '../../components/store/header';

export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <>
            <Header />
            <main>{children}</main>
            
        </>
    )
}