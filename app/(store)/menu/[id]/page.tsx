import {use } from 'react';
import { MenuItem } from '@/types/item';
import ItemDetailsForm from '@/components/store/menu/itemDetailsForm';
import { notFound } from 'next/navigation';
import { retryWithBackoff } from '@/lib/utils/api-retry';
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const id = (await params).id
    // fetch data
    const item = await getItem(id)
    
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: item.name,
  }
}
 
async function getItem(id: string): Promise<MenuItem> {
    try {
        const res = await retryWithBackoff(async () => 
            await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/api/store/items/${id}`)
        );
        
        
        if (!res.ok) {
            if (res.status === 404) {
                notFound();
            }
            throw new Error(`Failed to fetch item: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching item:', error);
        throw error; // Make sure to re-throw the error
    }
}

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getItem(id);
    if (!item) {
        notFound();
    }
    
    return <ItemDetailsForm itemId={item.id} />;
}