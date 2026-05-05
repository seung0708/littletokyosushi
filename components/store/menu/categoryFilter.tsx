'use client';

import { useState } from 'react';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryChange
}) => {
    return (
        <>
        <button
            onClick={() => onCategoryChange('all')}
            className={`menu-tab px-5 py-2 rounded-t-md border text-white text-medium ${
                selectedCategory === 'all' 
                ? 'bg-accent border-accent'
                : 'border-white/10 bg-black/30 hover:bg-red-600/50'
            }`}
        >
            All
        </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`menu-tab px-5 py-2 rounded-t-md border border-white/10 text-white text-medium transition-all ${
                        selectedCategory === category
                            ? 'bg-accent border-accent'
                            : 'bg-black/30 hover:bg-red-600/50'
                    }`}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            ))}
        </>
    );
};

export default CategoryFilter;