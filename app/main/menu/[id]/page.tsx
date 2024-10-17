'use client'
import {useEffect, useState} from 'react';
import { useParams, useRouter } from 'next/navigation';
import {products, Product} from '@/types/products';


const ProductDetailsPage: React.FC= () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const {id} = useParams()
    const productId = Number(id);

    const product = products.find(product => product.id === productId);

    useEffect(() => {
        if(!product) {
            router.push('/menu');
        }
    })

    if(!product) return null; 

    const closeModal = () => {
        router.push('/menu')
    }

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % product.images.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + product.images.length) % product.images.length);


    return(
        <section className='realtive z-10' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block' aria-hidden='true'></div>
             <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4'>
                    <span className='hidden md:inline-block md:h-screen md:align-middle' aria-hidden='true'>&#8203</span>
                    <div className='flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl'>
                        <div className='relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8'>
                            <button type='button' onClick={closeModal} className='absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8'>
                                <span className='sr-only'>Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className='grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8'>
                                {product.images.map((image, index) => (                           
                                <div className={`aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5 duration-700 ease-in-out ${index === activeIndex ? '' : 'hidden'}`} data-carousel-item>
                                    <img src={image} className='object-contain object-center absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' /> 
                                </div>
                                ))}
                                {/* Slide Indicators */}
                                <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-[150px] space-x-3">
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
                                    className="absolute top-1/2 left-0 z-30 flex items-center justify-center h-10 w-10 bg-black bg-opacity-50 rounded-full cursor-pointer transform -translate-y-1/2"
                                    aria-label="Previous Slide"
                                >
                                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1L1 5l4 4" />
                                    </svg>
                                </button>

                                {/* Next Button */}
                                <button
                                    onClick={nextSlide}
                                    className="absolute top-1/2 left-[275px] z-30 flex items-center justify-center h-10 w-10 bg-black bg-opacity-50 rounded-full cursor-pointer transform -translate-y-1/2"
                                    aria-label="Next Slide"
                                >
                                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 9l4-4-4-4" />
                                    </svg>
                                </button>
                                
                                <div className='h-full sm:col-span-8 lg:col-span-7'>
                                    <h2 className='text-xl font-medium text-gray-900 sm:pr-12'>{product.title}</h2>
                                    <div aria-labelledby='information-heading' className='mt-1'>
                                        <h3 id='information-heading' className='sr-only'>Menu item information</h3>
                                        <p className='font-medium text-gray-900'>${product.price.toFixed(2)}</p>
                                    </div>
                                    <div aria-labelledby='options-heading' className='h-5/6'>
                                        <h3 id='options-heading' className='sr-only'>Menu item options</h3>
                                        <form className='h-full flex flex-col'>
                                        {!product.modifierGroups ? 
                                        (
                                            <></>
                                        )
                                        :
                                        product.modifierGroups.map(modifierGroup => (
                                             
                                            (   
                                                <fieldset aria-label='' className='flex-grow'>
                                                    <legend className='text-sm font-medium'>{modifierGroup.name}</legend>
                                                        <div className='mt-3 flex flex-col items-start'>
                                                        {modifierGroup.modifiers.map(modifier => (
                                                            <>
                                                            <label aria-label='' className='relative flex cursor-pointer justify-center rounded-full p-2 ring-gray-900 focus:outline-none'>
                                                                <input type={modifierGroup.max < 2 ? 'radio' : 'checkbox'} name='sushi-choice' value={modifier.name} className='sr-only' />
                                                                <span aria-hidden='true' className={`h-4 w-4 ${modifierGroup.max < 2 ? 'rounded-full' : 'rounded-sm'} border border-black`}></span>
                                                                <span>{modifier.name}</span>
                                                            </label>
                                                           
                                                            </>
                                                        ))}
                                                        </div>
                                                </fieldset>
                                            )
                                        ))
                                        }
                                        <button type='submit' className='w-full rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>Add to Bag</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default ProductDetailsPage