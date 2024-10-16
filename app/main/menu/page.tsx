'use client';
import {useState} from 'react';
import { products } from "@/types/products"
import categories, {Category}  from "@/types/categories"
import MenuItems from "../components/menuItems"

const MenuPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const filteredProducts = selectedCategory ? products.filter(product => product.category.id === selectedCategory) : products;
    
    return (
        <section id="menu" className="py-24 sm:py-32">
            <div className="categories flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-5">
                {categories.map(category => (
                    <button className="bg-red-500 hover:bg-red-700 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-4 py-1 rounded-full" key={category.id} onClick={() => setSelectedCategory(category.id)}>{category.name}</button>
                ))}
            </div>
            <MenuItems products={filteredProducts} />
        </section>
    )
}

export default MenuPage