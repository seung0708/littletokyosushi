import { Items } from '../menu/page';
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface MenuItemsProps {
    items: Items[]
}

const MenuItems: React.FC<MenuItemsProps> = ({items}) => {
    const router = useRouter();
    
    const openProductDetails = (id: number) => {
        router.push(`/menu/${id}`)
    }

    return (
        <section className="menu__items mt-6">
            <div className="mt-6 grid grid-cols-2 gap-y-6 sm:gap-x-6 md:grid-cols-3">
            {items.map((item) => (
                <button onClick={() => openProductDetails(item.id)} key={item.id}>
                    <div className="w-4/5 mx-auto group relative rounded-md" >
                        <div className="w-full overflow-hidden rounded-md">
                            <Image 
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[0]}`} 
                                className='h-32 mx-auto sm:h-48 md:h-64 lg:72 object-contain' 
                                alt={`${item.name} image`} 
                                height={500}
                                width={500}
                            />
                        </div>
                        <div className="w-3/5 mx-auto">
                            <h3 className="text-wrap text-[13px] sm:text-sm md:text-md lg:text-lg"> {item.name}</h3>
                            <p className="mt-1 text-[13px] sm:text-sm md:text-md lg:text-lg">${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                </button>
            ))}
            </div>
        </section>
    )
}

export default MenuItems;