import Link from 'next/link'
import { Tabs, TabsContent} from '@/components/ui/tabs'
import { AddButton } from '../admin-ui/actionbuttons'

import React from 'react'
import ItemsTable from './components/itemstable'

const ProductPage: React.FC = () => {
    return(
        <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className='ml-auto flex items-center gap-2'>
                <Link href={'/items/add'}><AddButton>Add New Item</AddButton></Link>
                </div>
            </div>
            <TabsContent value="all">
                <ItemsTable />
            </TabsContent>
        </Tabs>
        </section>
    )
}

export default ProductPage