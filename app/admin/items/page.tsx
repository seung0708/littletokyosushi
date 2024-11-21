import Link from 'next/link'
import { Tabs, TabsContent} from '@/components/ui/tabs'
import { AddButton } from '../ui/actionbuttons'

import ItemsTable from '@/app/admin/ui/items/itemstable';
import { Suspense } from 'react';
import { ItemsListSkeleton } from '../ui/skeletons';
import { fetchMenuItemsPages } from '../lib/supabase/items-data';
import ItemsPagination from '../ui/items/pagination';
import { getCurrentPage } from '../lib/utils';

const ItemsPage: React.FC = async () => {
    const currentPage = getCurrentPage() || 1; 
    const totalPages = await fetchMenuItemsPages(); 
    return(
        <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className='ml-auto flex items-center gap-2'>
                <Link href={'/items/add'}><AddButton>Add New Item</AddButton></Link>
                </div>
            </div>
            <TabsContent value="all">
                <Suspense fallback={<ItemsListSkeleton />}>
                    <ItemsTable />
                </Suspense>
            </TabsContent>
        </Tabs>
        <ItemsPagination totalPages={totalPages} />
        </section>
    )
}

export default ItemsPage