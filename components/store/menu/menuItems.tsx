import Image from 'next/image';
import Link from 'next/link';
import { MenuItem, Modifier } from '@/types/item';

type MenuItemsProps = {
    categories: { name: string; items: MenuItem[] }[];
};

const MenuItems: React.FC<MenuItemsProps> = ({ categories }) => {
    
    return (
        <div className="space-y-12 sm:space-y-20">
            {categories.map((category) => (
                <div key={category.name} className="space-y-6 sm:space-y-8">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                            {category.name.split('')[0].toUpperCase() + category.name.substring(1)}
                        </h2>
                        <div className="flex-grow h-[1px] bg-gradient-to-r from-red-600/50 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {category.items.map((item) => ( 
                            <Link 
                                key={item.id} 
                                href={`/menu/${item.id}`}
                                className="group relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                         border border-white/10 hover:border-red-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="relative w-full h-48 sm:h-56 md:h-64">
                                    {item?.image_urls?.[0] ? (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[0]}`}
                                            alt={item.name}
                                            fill
                                            sizes="(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            className="rounded-t-xl object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-black/40 flex items-center justify-center rounded-t-xl">
                                            <span className="text-sm text-gray-400">No image available</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                </div>
                                <div className="relative p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3 flex-grow">
                                    <div className="flex justify-between items-start gap-3 sm:gap-4">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold group-hover:text-red-400 transition-colors line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <span className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-red-400 whitespace-nowrap bg-black/30 px-2 sm:px-3 py-1 rounded-full">
                                            ${item?.price?.toFixed(2)}
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="text-gray-300/90 text-xs sm:text-sm line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    {item.modifiers && item.modifiers.length > 0 && (
                                        <div className="pt-2 flex flex-wrap gap-1.5 sm:gap-2">
                                            {item.modifiers.map((modifier: Modifier, index: number) => (
                                                <span 
                                                    key={index} 
                                                    className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium 
                                                             bg-red-500/10 text-red-300 border border-red-500/20"
                                                >
                                                    {modifier.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuItems;