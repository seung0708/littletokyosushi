'use client';

import { useState, useEffect } from 'react';
import MenuItems from "@/components/store/menuItems";
import { Loading } from '@/components/ui/loading';
import { apiRequest } from "@/lib/utils/api-fetch";
import { APIError } from "@/lib/utils/api-error";

import { MenuItem} from '@/types/item';

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
            <div className="bg-black flex justify-center items-center min-h-screen py-12">
                <Loading variant="store" size="lg" />
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

    // Group items by category
    const categories = items.reduce<{ name: string; items: MenuItem[] }[]>((acc, item) => {
        const categoryName = item.categories?.name || 'Uncategorized';
        
        let category = acc.find(cat => cat.name === categoryName);
        if (!category) {
            category = {
                name: categoryName,
                items: []
            };
            acc.push(category);
        }
        category.items.push(item);
        return acc;
        
    }, []);

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
            
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-black text-white">
                <div className="max-w-7xl mx-auto">
                    <MenuItems categories={categories} />
                </div>
            </div>
        </>
    );
};

export default MenuPage;