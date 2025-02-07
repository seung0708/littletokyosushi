import { MenuItem } from '@/types/item';
import ItemDetailsForm from '@/components/store/menu/itemDetailsForm';
import { notFound } from 'next/navigation';

async function getItem(id: string): Promise<MenuItem> {
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_MAIN_URL || 'http://localhost:3000';
        
    const res = await fetch(`${baseUrl}/api/store/items/${id}`, {
        cache: 'no-store'
    });
    
    if (!res.ok) {
        if (res.status === 404) {
            notFound();
        }
        throw new Error(`Failed to fetch item: ${res.status}`);
    }

    return res.json();
}

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getItem(id);
    
    if (!item) {
        notFound();
    }
    
    return <ItemDetailsForm item={item} />;
}