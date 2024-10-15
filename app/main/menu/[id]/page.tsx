'use client'
import {useState} from 'react';
import {useParams} from 'next/navigation';
import {products} from '@/types/products';

const ProductDetailsPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const {id} = useParams();

    const product = products.find(product => product.id === Number(id));

    const nextSlide = () => setActiveIndex((prev) => (prev + 1));
    const prevSlide = () => setActiveIndex((prev) => (prev - 1));


    if(!product) return <p>Product Not Found</p>;

    return(
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5'>
             <div className="relative w-full" data-carousel="slide">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {product.images.map((image, index) => (
                    <div key={index} className={`duration-700 ease-in-out ${index === activeIndex ? '' : 'hidden'}`} data-carousel-item>
                        <img src={image} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                    </div>
                ))}
                <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                    {product.images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className="w-3 h-3 rounded-full"
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => setActiveIndex(index)}
                        ></button>
                    ))}
                </div>
                <button onClick={prevSlide} className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-4 h-4 text-gray dark:text-gray-800 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                    </span>
                </button>
                <button onClick={nextSlide} type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full">
                        <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
            <div className='flex flex-col justify-between'>
                <div className=''>
                    <h2 className='mb-9 font-bold text-2xl sm:text-4xl'>{product.title}</h2>
                    <p className='mb-9 sm:text-2xl'>{product.description}</p>
                    <p className='mb-9 sm:text-2xl'>${product.price.toFixed(2)}</p>
                </div>
                {!product.modifierGroups ? 
                 (
                    <></>
                )
                : 
                product.modifierGroups.map(modifierGroup => 
                    <div key={modifierGroup.id}>
                        <h3 className='mt-4'>{modifierGroup.name}:</h3>
                        {modifierGroup.modifiers.map(modifier => (
                             <div className="flex items-center space-x-3 space-y-2">
                             <label aria-label="White" className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-none">
                               <input type="radio" name="color-choice" value="White" className="sr-only"/>
                               <span aria-hidden="true" className="h-8 w-8 rounded-full border border-black border-opacity-10 bg-white"></span>
                             </label>
                             
                             <label aria-label="Gray" className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-none">
                               <input type="radio" name="color-choice" value="Gray" className="sr-only" />
                               <span aria-hidden="true" className="">{modifier.name}</span>
                             </label>
                             <label aria-label="Black" className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-900 focus:outline-none">
                               <input type="radio" name="color-choice" value="Black" className="sr-only" />
                               <span aria-hidden="true" className="h-8 w-8 rounded-full border border-black border-opacity-10 bg-gray-900"></span>
                             </label>
                           </div>
                        ))}
                    </div>
                )
                }
                <div>
                    <button className='bg-red-500 hover:bg-red-700 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-4 py-1 rounded-full'>Add to Bag</button>
                </div>
            </div>
            
        </div>
    )
}

export default ProductDetailsPage