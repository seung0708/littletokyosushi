import React from 'react';
import { Tabs, TabsList, TabsContent } from '@/components/ui/tabs';
import ProductsCard from './products/productscard';
import { ActionButtons } from './actionbuttons';

const TabsComponent: React.FC = () => {
    return (
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList />
          <ActionButtons />
        </div>
        <TabsContent value="all">
          <ProductsCard />
        </TabsContent>
      </Tabs>
    );
  };
  
export default TabsComponent;