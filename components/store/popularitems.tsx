'use client';

import { useState, useEffect } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/utils/api-fetch";
import { Database } from '@/types/database.types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'] & {
    categories: {
        id: string;
        name: string;
    };
};

const PopularItems: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const popularItemIds = [64, 2, 11, 19, 35, 34, 59, 64]; // IDs are strings in database

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

    const popularItems = items.filter(item => popularItemIds.includes(item.id));
    const shuffledItems = [...popularItems].sort(() => Math.random() - 0.5);

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
        <section aria-labelledby="popular-items" className="bg-black text-white sm:py-32">
            <div className="px-20 md:flex md:items-center md:justify-between mb-8">
                <h2 id='favorites-heading' className="text-3xl md:4xl md:text-left tracking-tight">
                    Popular Items
                </h2>
                <Link href="/menu" className="hidden md:block text-sm font-medium text-red-500 hover:text-red-600">
                    Shop for more items
                    <span aria-hidden='true'>&rarr;</span>
                </Link>
            </div>

            <div className="relative px-8">
                <Carousel 
                    setApi={setApi}
                    className="w-full"
                    opts={{
                        align: "start",
                        loop: true,
                        dragFree: true,
                        skipSnaps: true,
                    }}
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {shuffledItems.map((item) => (
                            <CarouselItem 
                                key={item.id} 
                                className="pl-2 md:pl-4 basis-1/3 md:basis-1/3 lg:basis-1/4"
                            >
                                <Card className="bg-black">
                                    <CardContent className="p-0">
                                        <Link href={`menu/${item.id}`}>
                                            <div className="relative group rounded-lg overflow-hidden aspect-[3/2]">
                                                <Image 
                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item?.image_urls?.[0]}`}
                                                    alt={`${item.name} image`}
                                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                    width={500}
                                                    height={300}
                                                    priority={true}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                                            </div>
                                            <div className="m-4 text-center text-white">
                                                <h3 className="text-lg font-medium group-hover:text-red-500">
                                                    {item.name}
                                                </h3>
                                                <p className="mt-1 text-sm">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" /> */}
                </Carousel>
            </div>

            <div className="mt-8 text-center md:hidden">
                <Link href="/menu" className="text-sm font-medium text-red-500 hover:text-red-600">
                    Shop for more items
                    <span aria-hidden='true'>&rarr;</span>
                </Link>
            </div>
        </section>
    );
};

export default PopularItems;