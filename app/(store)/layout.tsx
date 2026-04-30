import {ReactNode} from 'react';
import Header from '../../components/store/header';
import Footer from "@/components/store/footer"

export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <>
            <Header />
            <main className="overflow-x-hidden">{children}</main>
            <Footer />
        </>
    )
}