import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProductsCard from '../products/components/productscard';
import { ActionButtons } from './actionbuttons';
import TabsListComponent from './tabsList';

const TabsComponent: React.FC = () => {
    return (
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsListComponent />
          <ActionButtons />
        </div>
        <TabsContent value="all">
          <ProductsCard />
        </TabsContent>
      </Tabs>
    );
  };
  
export default TabsComponent;