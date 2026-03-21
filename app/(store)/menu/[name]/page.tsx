import { use } from 'react';
import { MenuItem } from '@/types/item';
import ItemDetailsForm from '@/components/store/menu/itemDetailsForm';
import { notFound } from 'next/navigation';
import { retryWithBackoff } from '@/lib/utils/api-retry';
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ name: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    try {
        const { name } = await params;
        const item = await getItem(name);
        
        if (!item) {
            return {
                title: 'Item Not Found',
                description: 'The requested menu item could not be found.'
            };
        }

        return {
            title: item.name,
            description: item.description || '',
            openGraph: {
                title: item.name,
                description: item.description || '',
                images: item.image_urls || []
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Error',
            description: 'An error occurred while loading the menu item.'
        };
    }
}

async function getItem(name: string): Promise<MenuItem | null> {
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
        console.error('NEXT_PUBLIC_SITE_URL is not defined');
        return null;
    }

    try {
        const url = `${process.env.NEXT_PUBLIC_MAIN_URL}/api/store/items/${name}`;
        console.log('Fetching item from:', url);
        
        const res = await retryWithBackoff(async () => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        });

        const data = await res.json();
        
        // Validate the response data
        if (!data || typeof data !== 'object') {
            console.error('Invalid response data:', data);
            return null;
        }

        // Ensure required fields exist
        if (!data.id || !data.name) {
            console.error('Missing required fields in item data:', data);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching item:', error);
        return null;
    }
}

export default async function ItemDetailsPage({ params }: { params: Promise<{ name: string }> }) {
    try {
        const { name } = await params;
        if (!name) {
            console.error('No ID provided');
            notFound();
        }

        const item = await getItem(name);
        if (!item || !item.id) {
            console.error('Item not found or invalid:', item);
            notFound();
        }

        return <ItemDetailsForm initialItem={item} />;
    } catch (error) {
        console.error('Error in ItemDetailsPage:', error);
        throw error; // Let Next.js handle the error
    }
}