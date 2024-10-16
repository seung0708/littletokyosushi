'use client';
import {useState} from 'react';
import { useRouter } from "next/navigation";
import { products, Product} from "@/types/products"

const MenuItems: React.FC = () => {
    const router = useRouter();
    
    const openProductDetails = (id: number) => {
        router.push(`/menu/${id}`)
    }

    return (
        <section className="menu__items mt-6">
            <div className="mt-6 grid grid-cols-2 gap-y-6 sm:gap-x-6 md:grid-cols-3">
            {products.map((product) => (
                <button onClick={() => openProductDetails(product.id)} key={product.id}>
                    <div className="w-4/5 mx-auto group relative rounded-md" >
                        <div className="w-full overflow-hidden rounded-md">
                            <img src={product.images[0]} className='h-32 mx-auto sm:h-48 md:h-64 lg:72' alt={`${product.title} image`} />
                        </div>
                        <div className="w-3/5 mx-auto">
                            <h3 className="text-wrap text-[13px] sm:text-sm md:text-md lg:text-lg"> {product.title}</h3>
                            <p className="mt-1 text-[13px] sm:text-sm md:text-md lg:text-lg">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                </button>
            ))}
            </div>
        </section>
    )
}

export default MenuItems;