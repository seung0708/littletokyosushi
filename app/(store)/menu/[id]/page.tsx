import { MenuItem } from '@/types/item';
import ItemDetailsForm from '@/components/store/menu/itemDetailsForm';

async function getItem(id: string): Promise<MenuItem> {
    const res = await fetch(`/api/store/items/${id}`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch item: ${res.status} ${errorText}`);
    }

    return res.json();
}

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getItem(id);
    return (
        <ItemDetailsForm item={item} />
    );
}