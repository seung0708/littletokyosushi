import { Product } from "@/types/products"
import ItemCard from "./itemCard"

const MenuItems: React.FC<{products: Product[]}> = ({products}) => {
    return (
        <div className="menu__items mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-colos-4 xl:gap-x-8">
        {products.map(product => (
            <div key={product.id} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img className="h-full w-full object-cover object-center lg:h-full lg:w-full" src={product.images[0]}/>
            </div>
            <div className="mt-4 flex flex-col justify-between">
                <h3>{product.title}</h3>
                <p>{product.price}</p>
            </div>
            </div>
        ))}
        </div>
    )
}

export default MenuItems;