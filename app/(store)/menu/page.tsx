'use client';

import { useState, useEffect } from 'react';
import MenuItems from "@/components/store/menuItems";
import { apiRequest } from "@/lib/utils/api-fetch";
import { APIError } from "@/lib/utils/api-error";
import { Database } from '@/types/database.types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

const MenuPage: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsData = await apiRequest<MenuItem[]>('/api/store/items', {
                    timeout: 5000,
                    retries: 3,
                });
                setItems(itemsData);
            } catch (error) {
                console.error('Error fetching menu data:', error);
                if (error instanceof APIError) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading menu items...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    // Group items by category
    const itemsByCategory = items.reduce<Record<string, { name: string; items: MenuItem[] }>>((acc, item) => {
        const categoryId = item.category_id;
        const categoryName = item.categories?.name || 'Uncategorized';
        
        if (!acc[categoryId]) {
            acc[categoryId] = {
                name: categoryName,
                items: []
            };
        }
        acc[categoryId].items.push(item);
        return acc;
    }, {});

    return (
        <div className="container mx-auto px-4 py-8">
            <MenuItems items={items} categories={itemsByCategory} />
        </div>
    );
};

export default MenuPage;