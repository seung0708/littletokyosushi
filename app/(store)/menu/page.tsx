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
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [items, setItems] = useState<Items[]>([]);
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
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredItems = selectedCategory ? items.filter(item => item.category_id === selectedCategory) : items;
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <section id="menu" className="py-24 sm:py-32">
            <div className="categories flex flex-wrap sm:flex-nowrap justify-center gap-2 text-white text-[14px] sm:text-sm md:text-md lg:text-lg">
                {categories.map(category => (
                    <button 
                        className="bg-red-500 hover:bg-red-800 rounded-full px-4 py-1" 
                        key={category?.id} 
                        onClick={() => setSelectedCategory(category?.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            <MenuItems items={filteredItems} />
        </section>
    )
}

export default MenuPage