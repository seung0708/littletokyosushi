'use client'
import { products } from "@/types/products"
import { useParams } from "next/navigation";

const PopularItems: React.FC = () => {
    const {id} = useParams();
    const topThree = products.slice(0,3);

    return (
        <section aria-labelledby="popular-items">
            <div className="py-24 sm:py-32 px-32">
                <div className="md:flex md:items-center md:justify-between">
                    <h2 id='favorites-heading' className="text-2xl font-bold tracking-tight">Popular Items</h2>
                    <a href="/menu" className="text-sm font-medium text-red-500 hover:text-red-600 md: block">Shop for more items
                        <span aria-hidden='true'>&rarr;</span>
                    </a>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-0 lg:gap-x-8">
                {topThree.map((product, index) => (
                    <div className="w-4/5 mx-auto group relative rounded-md border-red-500 hover:border-2" key={index}>
                        <div className="w-full overflow-hidden rounded-md">
                            <img src={product.images[0]} className='h-80 mx-auto' alt={`${product.title} image`} />
                        </div>
                        <div className="w-3/5 mx-auto">
                            <h3 className="mt-4 text-md hover:text-red-500"> {product.title}</h3>
                            <p className="mt-1">${product.price.toFixed(2)}</p>
                            <a href={`menu/${product.id}`} className="absolute right-20 bottom-4 bg-red-500 rounded-lg text-white px-4 py-2">Order Now</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
    )
}

export default PopularItems;