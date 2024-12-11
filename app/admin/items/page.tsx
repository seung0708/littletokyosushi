'use client';

import {useState, useEffect} from 'react'
import Link from 'next/link'
import { Tabs, TabsContent} from '@/components/ui/tabs'
import { AddButton } from '@/components/admin/actionbuttons'
import ItemsTable from '@/components/admin/itemstable';
import ItemsPagination from '@/components/admin/pagination';
import SearchBar from '@/components/admin/searchbar';
import { fetchMenuItemsPages, fetchFilteredItems } from '@/lib/services/items';
import { Product } from '@/types/definitions';
import { useSearchParams } from 'next/navigation';

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        const query = searchParams.get('query') || '';
        const currentPage = Number(searchParams.get('page')) || 1;

        const { items: fetchedItems, error } = await fetchFilteredItems(query, currentPage);
        const pages = await fetchMenuItemsPages(query);
        
        if (error) {
          throw error;
        }

        setItems(fetchedItems);
        setTotalPages(pages);
        setError(null);
      } catch (err) {
        console.error('Failed to load items:', err);
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [searchParams]); // Only depend on searchParams

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <Tabs defaultValue="all">
        <div className='flex items-center justify-between'>
          <div className='flex flex-1 items-center space-x-2'>
            <SearchBar />
            <Link href={'/items/add'}><AddButton>Add New Item</AddButton></Link>
          </div>
        </div>
        <TabsContent value="all">
          <ItemsTable items={items} />
        </TabsContent>
      </Tabs>
      <ItemsPagination totalPages={totalPages} />
    </section>
  );
}
