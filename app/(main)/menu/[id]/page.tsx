'use client'
import {useEffect, useState} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Item } from '@/types/definitions';
import Image from 'next/image';

const ProductDetailsPage: React.FC= () => {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const {id} = useParams()
    const itemId = Number(id);

    useEffect(() => {
        const fetchItem = async () => {
            try {
              setLoading(true);
              const response = await fetch(`/api/main/items/${itemId}`, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const data = await response.json();
              console.log('Fetched item data:', data);
              
              const fetchedItem = data.item;
              if (!fetchedItem) {
                throw new Error('No item data in response');
              }
              setItem(fetchedItem);
            } catch (error) {
              console.error('Error fetching item:', error);
            } finally {
              setLoading(false);
            }
        };
        fetchItem();
    },[])

    const closeModal = () => {
        router.push('/menu')
    }

    // const nextSlide = () => setActiveIndex((prev) => (prev + 1) % item?.image_urls.length);
    // const prevSlide = () => setActiveIndex((prev) => (prev - 1 + item?.image_urls.length) % item?.image_urls.length);


    return(
        <section className='realtive z-10' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block' aria-hidden='true'></div>
             <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4'>
                    
                    <div className='flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl'>
                        <div className='relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8'>
                            <button type='button' onClick={closeModal} className='absolute z-30 right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8'>
                                <span className='sr-only'>Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className='grid w-full grid-cols-1 items-start'>
                                {item?.image_urls.map((image, index) => (                           
                                <div className={`relative w-full aspect-square rounded-lg duration-700 ease-in-out ${index === activeIndex ? '' : 'hidden'} border-b`} data-carousel-item>
                                    <Image 
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${image}`} 
                                        alt='item image' 
                                        className='object-cover w-full h-full'
                                        width={400}
                                        height={400}
                                        priority={index === 0}
                                    /> 
                                </div>
                                ))}
                               
                                <div className='mt-6 sm:col-span-8 lg:col-span-7'>
                                    <h2 className='text-xl font-medium text-gray-900 sm:pr-12'>{item?.name}</h2>
                                    <div aria-labelledby='information-heading' className='mt-1'>
                                        <div></div>
                                        <h3 id='information-heading' className='sr-only'>Menu item information</h3>
                                        <p className='mt-3 font-medium text-gray-900'>{item?.description}</p>
                                        <p className='mt-3 font-medium text-gray-900'>${item?.price.toFixed(2)}</p>
                                    </div>
                                    <div aria-labelledby='options-heading' className=''>
                                        <h3 id='options-heading' className='sr-only'>Menu item options</h3>
                                        <form className='h-full flex flex-col'>
                                        {/* {!item?.modifierGroups ? 
                                        (
                                            <></>
                                        )
                                            :
                                        item?.modifierGroups.map(modifierGroup => (
                                             
                                            (   
                                                <fieldset aria-label='' className='flex-grow'>
                                                    <legend className='text-sm font-medium'>{modifierGroup?.name}</legend>
                                                        <div className='mt-3 flex flex-col items-start'>
                                                        {modifierGroup?.modifiers.map(modifier => (
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
                                        } */}
                                        <button type='submit' className='mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>Add to Bag</button>
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