
import ProductsCard from './components/productscard'
import { Tabs, TabsContent} from '@/components/ui/tabs'
import TabsListComponent from '../components/tabsList'
import { ActionButtons } from '../components/actionbuttons'

import React from 'react'

const ProductPage: React.FC = () => {
    return(
        <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsListComponent />
                <ActionButtons />
            </div>
            <TabsContent value="all">
                <ProductsCard />
            </TabsContent>
        </Tabs>
        </section>
    )
}

export default ProductPage