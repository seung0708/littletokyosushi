import { products } from "@/types/products"
import Image from "next/image";

const PopularItems: React.FC = () => {
    const topThree = products.slice(0,3);

    return (
        <section className="max-w-5xl mx-auto ">
            <h2 className="text-center text-4xl mb-8">Popular Items</h2>
            <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {topThree.map((product, index) => (
                    <div key={index}>
                        <Image src={product.images[0]} width={100} height={100} alt={`${product.title} image`} />
                        <h3>{product.title}</h3>
                        <h4>{product.category.name}</h4>
                        <p>{product.price.toFixed(2)}</p>
                    </div>
            ))}
            </div>
        </section>
    )
}

export default PopularItems;