'use client'
import {useParams} from 'next/navigation';
import {products} from '@/types/products';

const ProductDetailsPage: React.FC = () => {
    const {id} = useParams();

    const product = products.find(product => product.id === Number(id));

    if(!product) return <p>Product Not Found</p>;

    return(
        <div className='max-w-7xl mx-auto grid grid-cols-2 gap-5'>
            <div>
                <img className='aspect-h-4 aspect-w-3' src={product.images[0]}/>
            </div>
            <div>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <button>Order Now</button>
            </div>
        </div>
    )
}

export default ProductDetailsPage