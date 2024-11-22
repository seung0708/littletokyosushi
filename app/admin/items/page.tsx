import Link from 'next/link'
import { Tabs, TabsContent} from '@/components/ui/tabs'
import { AddButton } from '../ui/actionbuttons'

import ItemsTable from '@/app/admin/ui/items/itemstable';
import { Suspense } from 'react';
import { ItemsListSkeleton } from '../ui/skeletons';
import { fetchMenuItemsPages } from '../lib/supabase/items-data';
import ItemsPagination from '../ui/items/pagination';
import SearchBar from '../ui/searchbar';

const ItemsPage = async (props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) => {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page);
    const totalPages = await fetchMenuItemsPages(query); 
    return(
        <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className='ml-auto flex items-center gap-2'>
                <SearchBar />
                <Link href={'/items/add'}><AddButton>Add New Item</AddButton></Link>
                </div>
            </div>
            <TabsContent value="all">
                <Suspense fallback={<ItemsListSkeleton />}>
                    <ItemsTable query={query} currentPage={currentPage} />
                </Suspense>
            </TabsContent>
        </Tabs>
        <ItemsPagination totalPages={totalPages} />
        </section>
    )
}

export default ItemsPage