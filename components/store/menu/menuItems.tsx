import Image from 'next/image';
import Link from 'next/link';
import { MenuItem, ModifierGroup } from '@/types/item';

type MenuItemsProps = {
    categories: { name: string; items: MenuItem[] }[];
};

const MenuItems: React.FC<MenuItemsProps> = ({ categories }) => {
    //console.log(categories);
    return (
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
            {categories.map((category) => (
                <div key={category.name} className="mb-14">
                    <div className="flex items-baseline gap-4 mb-7">
                        <h2 className="font-serif font-normal text-white text-[28px] tracking-tight">
                            {category.name.split('')[0].toUpperCase() + category.name.substring(1)}
                        </h2>
                        <div className="flex-1 h-px bg-[#2a2a2a]"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {category.items.map((item) => (
                        <Link key={item.id} href={`/menu/${encodeURIComponent(item.name)}`}
                        >
                            <article className="group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex flex-col">
                                <div className="h-[180px] flex items-center justify-center shrink-0" style={{ background: '#ede9e4' }}>
                                    <Image 
                                        src={item.image_urls[0]} 
                                        alt={item.name} 
                                        width={200}
                                        height={200}
                                        loading="eager"
                                    />
                                    
                                </div>
                                <div className="p-4 flex flex-col gap-1.5 flex-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-[15px] font-semibold text-[#111] leading-snug">{item.name}</h3>
                                        <span className="text-sm font-semibold text-accent shrink-0">${item.base_price?.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-[#888] leading-relaxed flex-1 line-clamp-2">{item.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-2.5">
                                        {/* <div className="flex flex-wrap gap-1">
                                            <span className="text-[10px] font-medium bg-accent-light text-accent border border-accent-border rounded-full px-2 py-0.5">Spicy</span>
                                            <span className="text-[10px] font-medium bg-accent-light text-accent border border-accent-border rounded-full px-2 py-0.5">No Avocado</span>
                                        </div> */}
                                    </div>
                                </div>
                            </article>
                        </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuItems;


