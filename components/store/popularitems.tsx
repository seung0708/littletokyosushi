'use client';

import { useState, useEffect } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/utils/api-fetch";
import { MenuItem } from '@/types/item';

const PopularItems: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const popularItemIds = ["Little Tokyo Sushi Combination", "California Roll", "Toro Combo", "Spicy Tuna Roll", "Salmon Combo"]

    // Fetch items
    useEffect(() => {
        const fetchPopularItems = async () => {
            try {
                const data = await apiRequest<MenuItem[]>('/api/store/items', {
                    timeout: 5000,
                    retries: 3,
                });
                
                setItems(data);
            } catch (error) {
                console.error('Error fetching popular items:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch items');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPopularItems();
    }, []);

    // Handle carousel navigation
    useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    // Optional: Autoplay
    useEffect(() => {
        if (!api) return;

        const intervalId = setInterval(() => {
            api.scrollNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(intervalId);
    }, [api]);

    const popularItems = items.filter(item => popularItemIds.includes(item.name || ""));

    if (isLoading) {
        return (
            <section className="bg-black text-white py-16 sm:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center">Loading popular items...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-black text-white py-16 sm:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </section>
        );
    }

    if (popularItems.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="popular-items" className="bg-dark py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-baseline justify-between mb-9">
                    <h2 id='favorites-heading' className="font-serif font-normal text-white tracking-tight" style={{fontSize: 'clamp(28px, 3vw, 40px'}}>Popular Items</h2>
                    <Link href="/menu" className="text-sm font-medium text-accent flex items-center gap-1.5 hover:gap-2.5 transition-all">View full menu <span>→</span></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {popularItems.map(item => (
                        <a href={'/menu/' + item.name} className="group cursor-pointer">
                            <div className="aspect-square rounded-[10px] overflow-hidden border-2 border-transparent group-hover:border-accent group-hover:-translate-y-1 transition-all duration-200 flex items-center justify-center" style={{background: "repeating-linear-gradient(45deg,#222 0,#222 1px,#1a1a1a 1px,#1a1a1a 14px)"}}>
                                <Image 
                                    src={item.image_urls[0] || "/placeholder.png"} 
                                    alt={item.name || "Menu Item"} 
                                    width={200}
                                    height={200}
                                    className="object-fit w-full  md:object-cover" /> 
                            </div>
                            <div className="mt-2.5 text-center">
                                <p className="text-[13px] font-medium text-white group-hover:text-accent transition-colors mb-0.5">{item.name}</p>
                                <p className="text-xs text-white/40">${item.base_price.toFixed(2)}</p>
                            </div>
                       </a>
                       
                    ))}
                </div>
            </div>       
        </section>
    );
};

export default PopularItems;