'use client'
import {useState} from 'react';
import {useParams} from 'next/navigation';
import {products} from '@/types/products';

const ProductDetailsPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const {id} = useParams();

    const product = products.find(product => product.id === Number(id));

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % product.images.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + product.images.length) % product.images.length);


    if(!product) return <p>Product Not Found</p>;

    return(
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5'>
             <div className="relative w-full" data-carousel="slide">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {product.images.map((image, index) => (
                    <div key={index} className={`duration-700 ease-in-out ${index === activeIndex ? '' : 'hidden'}`} data-carousel-item>
                        <img src={image} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt={`Slide ${index + 1}`} />
                    </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
                    {product.images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-white' : 'bg-gray-300'}`}
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => setActiveIndex(index)}
                        ></button>
                    ))}
                </div>

                {/* Previous Button */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 z-30 flex items-center justify-center h-10 w-10 bg-black bg-opacity-50 rounded-full cursor-pointer transform -translate-y-1/2"
                    aria-label="Previous Slide"
                >
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1L1 5l4 4" />
                    </svg>
                </button>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 z-30 flex items-center justify-center h-10 w-10 bg-black bg-opacity-50 rounded-full cursor-pointer transform -translate-y-1/2"
                    aria-label="Next Slide"
                >
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 9l4-4-4-4" />
                    </svg>
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
                            {modifierGroup.max < 2 ? (
                                <label aria-label="White" className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-none">
                                <input type="radio" name="color-choice" value="White" className="sr-only" required/>
                                <span aria-hidden="true" className="h-5 w-5 me-3 my-2 rounded-full border border-black border-opacity-10 bg-white"></span>
                                 {modifier.name}
                              </label>
                            ): (
                                <label aria-label="White" className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-none">
                                <input type="checkbox" name="color-choice" value="White" className="sr-only" required />
                                <span aria-hidden="true" className="h-5 w-5 me-3 my-2 border border-black border-opacity-10 bg-white"></span>
                                 {modifier.name}
                              </label>
                            )}
                             
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