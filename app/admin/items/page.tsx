'use client';

import {useState, useEffect} from 'react'
import Link from 'next/link'
import { Tabs } from '@/components/ui/tabs'
import { AddButton } from '@/components/admin/actionbuttons'
import ItemsTable from '@/components/admin/items/itemstable';
import Pagination from '@/components/admin/pagination';
import SearchBar from '@/components/admin/searchbar';
import { MenuItem } from '@/types/item';
import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui/loading'
import { Suspense } from 'react';

// Wrapper component that uses searchParams
function ItemsContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const page = searchParams.get('page') || '1';
        const query = searchParams.get('query') || '';
        const category = searchParams.get('category') || 'all';

        const response = await fetch(`/api/admin/items?page=${page}&query=${query}&category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [searchParams]); // Only depend on searchParams

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <Tabs defaultValue="all">
        <div className='flex items-center justify-end gap-4'>
          <SearchBar />
          <Link href="/admin/items/add"><AddButton>Add Item</AddButton></Link>
        </div>
        <ItemsTable menuItems={items} />
      </Tabs>
      <Pagination totalPages={totalPages} />
    </section>
  );
}

// Main page component with Suspense
export default function ItemsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Loading variant="admin" size="lg" />
        </div>
      }
    >
      <ItemsContent />
    </Suspense>
  );
}
