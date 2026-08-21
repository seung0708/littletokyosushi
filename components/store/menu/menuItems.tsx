import Image from 'next/image';
import Link from 'next/link';
import { MenuItem, ModifierGroup } from '@/types/item';

type MenuItemsProps = {
    categories: { name: string; items: MenuItem[] }[];
};

const MenuItems: React.FC<MenuItemsProps> = ({ categories }) => {
    //console.log(categories);
    return (
        <div className="">
            {categories.map((category) => (
                <div key={category.name} className="mb-14">
                    <div className="flex items-baseline gap-4 mb-7">
                        <h2 className="font-serif font-normal text-white text-[28px] tracking-tight">
                            {category.name.split('')[0].toUpperCase() + category.name.substring(1)}
                        </h2>
                        <div className="flex-1 h-px bg-[#555555]"></div>
                    </div>
                    <div className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                            {category.items.map((item) => (
                                <Link key={item.id} href={`/menu/${encodeURIComponent(item.name)}`}>
                                    <div>
                                        <Image 
                                            src={item.image_urls?.[0] || "/placeholder.png"} 
                                            alt={item.name} 
                                            width={200}
                                            height={200}
                                            className="aspect-square w-full rounded-lg bg-gray-100 object-contain group-hover:opacity-75"
                                            loading="eager"
                                        />
                                    
                                    </div>
                                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-[15px] font-semibold text-[#111] leading-snug">{item.name}</h3>
                                            <span className="text-sm font-semibold text-accent shrink-0">${item.base_price?.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-[#888] leading-relaxed flex-1 line-clamp-2">{item.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuItems;


