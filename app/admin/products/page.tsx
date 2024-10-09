import TabsComponent from '@/app/components/tabscomponent'
import React from 'react'

const ProductPage: React.FC = () => {
    return(
        <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <TabsComponent />
        </section>
    )
}

export default ProductPage