import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabsListComponent: React.FC = () => {
    return (
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="archived" className="hidden sm:flex">
          Archived
        </TabsTrigger>
      </TabsList>
    );
};

export default TabsListComponent;