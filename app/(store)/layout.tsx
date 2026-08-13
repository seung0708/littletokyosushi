import {ReactNode} from 'react';
import Header from '../../components/store/header';
import Footer from "@/components/store/footer"
import {createClient} from '@/lib/supabase/server'

export default async function MainLayout({children}: {children: ReactNode}) {
    const supabase = await createClient();

    const {data: categories, error} = await supabase
        .from('categories')
        .select('*')

    return (
        <>
            <Header categories={categories} />
            <main className="overflow-x-hidden">{children}</main>
            <Footer />
        </>
    )
}