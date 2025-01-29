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
import { Card, CardContent } from "@/components/ui/card";



const PopularItems: React.FC = () => {
    const [items, setItems] = useState([]);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const ids = [64, 2, 11, 19, 35, 34, 59, 64];

    // Fetch items
    useEffect(() => {
        const fetchPopularItems = async () => {
            const response = await fetch('/api/store/items');
            const data = await response.json();
            setItems(data);
        }
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

    const popularItems = items.filter(item => ids.includes(item.id));
    const shuffledItems = [...popularItems].sort(() => Math.random() - 0.5);

    return (
        <section aria-labelledby="popular-items" className="bg-black text-white py-24 sm:py-32">
            <div className="px-20 md:flex md:items-center md:justify-between mb-8">
                <h2 id='favorites-heading' className="text-3xl md:4xl text-center md:text-left tracking-tight">
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
                    }}
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {shuffledItems.map((item, index) => (
                            <CarouselItem 
                                key={item.id} 
                                className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                                <Card className="">
                                    <CardContent className="p-0">
                                        <Link href={`menu/${item.id}`}>
                                            <div className="relative group rounded-lg overflow-hidden aspect-[4/3]">
                                                <img 
                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[0]}`}
                                                    alt={`${item.name} image`}
                                                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                                            </div>
                                            <div className="mt-4 text-center">
                                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-red-500">
                                                    {item.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="absolute text-red-500 -left-8 top-1/2 transform -translate-y-1/2" />
                    <CarouselNext className="absolute text-red-500 -right-8 top-1/2 transform -translate-y-1/2" />
                </Carousel>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-4">
                    {shuffledItems.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 w-2 rounded-full transition-colors ${
                                current === index ? "bg-red-500" : "bg-gray-300"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PopularItems;