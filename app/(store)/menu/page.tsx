'use client';

import { useState, useEffect } from 'react';
import MenuItems from "@/components/store/menu/menuItems";
import { apiRequest } from "@/lib/utils/api-fetch";
import { APIError } from "@/lib/utils/api-error";

import { MenuItem} from '@/types/item';
import { MenuCategorySkeleton } from '@/components/store/menu/menuItemSkeleton';
import { retryWithBackoff } from '@/lib/utils/api-retry';
import CategoryFilter from '@/components/store/menu/categoryFilter';

const MenuPage: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsData = await retryWithBackoff(async () =>  
                    await apiRequest<MenuItem[]>('/api/store/items', {
                        timeout: 5000,
                        retries: 3,
                    })
                );
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
            <div className="min-h-screen bg-black text-white pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12 sm:space-y-20">
                        {[...Array(3)].map((_, i) => (
                            <MenuCategorySkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen py-12">
                <div className="text-center text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    const categories = [...new Set(items.map(item => item.categories?.name || 'uncategorized'))].sort();

    const filteredItems = selectedCategory === 'all' 
        ? items 
        : items.filter(item => item.categories?.name === selectedCategory);

    const groupedItems = filteredItems.reduce((acc, item) => {
        const category = item.categories?.name || 'uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
     }, {} as Record<string, MenuItem[]>);
    
    
    const categorizedItems = Object.entries(groupedItems).map(([name, items]) => ({
        name,
        items
    }));


    return (
        <>
            <div className="w-full bg-black pt-20 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Our Menu</h1>
                        <div className="w-16 sm:w-24 h-1 bg-red-600 mx-auto mb-3 sm:mb-4"></div>
                        <p className="text-base sm:text-lg text-gray-300 pb-4">
                            Discover our selection of authentic Japanese dishes
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-black min-h-screen text-white">
                <div className="max-w-7xl mx-auto">
                    <CategoryFilter 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                    <MenuItems categories={categorizedItems} />
                </div>
            </div>
        </>
    );
};

export default MenuPage;