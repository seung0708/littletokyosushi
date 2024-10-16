import { Product } from "@/types/products"
import ItemCard from "./itemCard"

const MenuItems: React.FC<{products: Product[]}> = ({products}) => {
    return (
        <section className="menu__items mt-6">
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-0 lg:gap-x-8">
            {products.map((product, index) => (
                <div className="sm:w-4/5 mx-auto group relative rounded-md border-red-500 hover:border-2" key={index}>
                <div className="w-full overflow-hidden rounded-md">
                    <img src={product.images[0]} className='h-32 sm:h-64 md:h-72 lg:h-80 mx-auto' alt={`${product.title} image`} />
                </div>
                <div className="w-3/5 mx-auto">
                    <h3 className="mt-4 text-xs sm:text-md hover:text-red-500"> {product.title}</h3>
                    <p className="mt-1 text-xs">${product.price.toFixed(2)}</p>
                    <a href={`menu/${product.id}`} className="absolute right-1 bottom-1 sm:right-10 bg-red-500 rounded-lg text-white text-xs px-1 sm:px-2 py-1 sm:px-2">
                        <span className="md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M20 7h-4v-3c0-2.209-1.791-4-4-4s-4 1.791-4 4v3h-4l-2 17h20l-2-17zm-11-3c0-1.654 1.346-3 3-3s3 1.346 3 3v3h-6v-3zm-4.751 18l1.529-13h2.222v1.5c0 .276.224.5.5.5s.5-.224.5-.5v-1.5h6v1.5c0 .276.224.5.5.5s.5-.224.5-.5v-1.5h2.222l1.529 13h-15.502z"/></svg>
                        </span>
                        <span className="hidden md:block">
                            Order Now
                        </span>
                        
                    </a>
                </div>
            </div>
            ))}
            </div>
        </section>
    )
}

export default MenuItems;