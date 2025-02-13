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
        <div className="flex justify-center flex-wrap gap-2 mb-8">
            <button
                onClick={() => onCategoryChange('all')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-black/30 hover:bg-red-600/50'
                }`}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                        selectedCategory === category
                            ? 'bg-red-600 text-white'
                            : 'bg-black/30 hover:bg-red-600/50'
                    }`}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;