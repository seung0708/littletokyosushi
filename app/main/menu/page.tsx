'use client';
import {useState, useEffect} from 'react';
import { Product, Category } from "@/types/definitions"
import MenuItems from "../components/menuItems"
import { createClient } from "@/lib/supabase/client";

const MenuPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient();
                
                // Fetch products
                const { data: productsData, error: productsError } = await supabase
                    .from('menu_items')
                    .select('*');
                
                if (productsError) throw productsError;
                setProducts(productsData || []);

                // Fetch categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('*');
                
                if (categoriesError) throw categoriesError;
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = selectedCategory 
        ? products.filter(product => product.category_id === selectedCategory) 
        : products;
    
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
                        {category.category_name}
                    </button>
                ))}
            </div>
            <MenuItems products={filteredProducts} />
        </section>
    )
}

export default MenuPage