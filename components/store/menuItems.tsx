import { Database } from '@/types/database.types';
import Image from 'next/image';
import Link from 'next/link';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

type MenuItemsProps = {
    items: MenuItem[];
    categories: Record<string, { name: string; items: MenuItem[] }>;
};

const MenuItems: React.FC<MenuItemsProps> = ({ items, categories }) => {
    return (
        <div className="space-y-12">
            {Object.entries(categories).map(([categoryId, category]) => (
                <div key={categoryId} className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.filter(item => item.category_id === categoryId).map((item) => (
                            <Link 
                                key={item.id} 
                                href={`/menu/${item.id}`}
                                className="group relative overflow-hidden rounded-lg bg-gray-100 p-4 hover:bg-gray-200 transition-colors"
                            >
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                                    {item.image_url && (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_url}`}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center"
                                            width={300}
                                            height={300}
                                        />
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium">{item.name}</h3>
                                    {item.description && (
                                        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                                    )}
                                    <p className="mt-2 text-lg font-medium">${item.price.toFixed(2)}</p>
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