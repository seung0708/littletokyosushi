'use client';
import {useState, useEffect} from 'react';
import MenuItems from "../components/menuItems"
import { createClient } from "@/lib/supabase/client";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/main/items');
                const data = await response.json();
                setItems(data.items)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const itemsResponse = await fetch('/api/main/items');
                const items = await itemsResponse.json();
                console.log(items)
                setItems(items.items)

                const categoriesResponse = await fetch('/api/main/categories');
                const categories = await categoriesResponse.json();
                console.log(categories)
                setCategories(categories)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredItems = selectedCategory 
        ? items.filter(item => item.category_id === selectedCategory) 
        : items;
    
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