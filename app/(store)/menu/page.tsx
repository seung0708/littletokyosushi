'use client';
import {useState, useEffect} from 'react';
import MenuItems from "../../../components/store/menuItems"
import { apiRequest } from "@/lib/utils/api-fetch";
import { APIError } from "@/lib/utils/api-error";

interface Category {
    id: number;
    name: string;
}

export interface Items {
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    is_available: boolean;
    special_instructions: string;
    image_urls: string[];
    category_name: string;
    quantity_in_stock: number;
    low_stock_threshold: number;
    sync_status: boolean;
}

const MenuPage: React.FC = () => {
    const [items, setItems] = useState<Items[]>([]);
    console.log(items);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const categoriesData = await apiRequest<Category[]>('/api/store/categories', {
                    timeout: 5000, 
                    retries: 3, 
                });
                setCategories(categoriesData)
                const itemsData = await apiRequest<Items[]>('/api/store/items', {
                    timeout: 5000, 
                    retries: 3, 
                });
                setItems(itemsData);
            } catch (error) {
                console.error('Error fetching menu data:', error);
                if(error instanceof APIError) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
        const categoryId = item.categories.id;
        if (!acc[categoryId]) {
            acc[categoryId] = {
                name: item.categories.name,
                items: []
            };
        }
        acc[categoryId].items.push(item);
        return acc;
    }, {} as Record<number, { name: string; items: Items[] }>);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section id="menu" className="bg-black text-white py-24 sm:py-32">
            <div className="container mx-auto px-4">
                {Object.entries(itemsByCategory).map(([categoryId, category]) => (
                    <div key={categoryId} className="mb-12 text-center">
                        <h2 className="text-4xl text-red-500 font-bold mb-6">{category.name.split('')[0].toUpperCase() + category.name.substring(1)}</h2>
                        <MenuItems items={category.items} />
                    </div>
                ))}
            </div>
    </section>
    );
};

export default MenuPage;