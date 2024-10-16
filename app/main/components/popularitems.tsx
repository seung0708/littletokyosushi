'use client'
import { products } from "@/types/products"

const PopularItems: React.FC = () => {
    const topThree = products.slice(0,3);

    return (
        <section aria-labelledby="popular-items">
            <div className="py-24 sm:py-32">
                <div className="px-20 md:flex md:items-center md:justify-between">
                    <h2 id='favorites-heading' className="text-3xl md:4xl text-center md:text-left tracking-tight">Popular Items</h2>
                    <a href="/menu" className="hidden md:block text-sm font-medium text-red-500 hover:text-red-600 md: block">Shop for more items
                        <span aria-hidden='true'>&rarr;</span>
                    </a>
                </div>
                <div className="mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 justify-items-center">
                {topThree.map((product) => (
                    <a href={`menu/${product.id}`} key={product.id}>
                        <div className="w-48 sm:w-56 md:w-64 lg:w-72 group relative rounded-md " >
                            <div className="w-full overflow-hidden rounded-md">
                                <img src={product.images[0]} className='h-40 mx-auto sm:h-48 md:h-64 lg:72' alt={`${product.title} image`} />
                            </div>
                            <div className="w-3/5 mx-auto">
                                <h3 className="mt-4 text-wrap text-[16px] sm:text-sm md:text-md lg:text-lg hover:text-red-500"> {product.title}</h3>
                                <p className="mt-1 text-wrap text-[14px] sm:text-sm md:text-md lg:text-lg">${product.price.toFixed(2)}</p>
                            
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </section>
    )
}

export default PopularItems;