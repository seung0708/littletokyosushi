'use client'
import { useEffect, useState } from "react";
import { useCart, CartItem } from "../../context/cartContext";
import { useRouter } from "next/navigation"
import { Modifier } from "@/types/definitions";

const CartPage: React.FC = () => {
    const [items, setItems] = useState([])
    const [allModifiers, setAllModifiers] = useState<Modifier[][]>([])
    //console.log('allModifiers', allModifiers);
    const { cartItems} = useCart(); 
    console.log('cartItems', cartItems);
    const router = useRouter();
    const handleClick = () => {
        router.push('/checkout')
    }

    useEffect(() => {
        if (cartItems.length > 0) {
            fetchMenuItem();
            fetchModifiers();
        }
    }, [cartItems]);


    const fetchMenuItem = async () => {
        try {
            const itemPromises = cartItems.map(async (item) => {
                const response = await fetch(`/api/store/items/${item.menu_item_id}`);
                if (!response.ok) throw new Error('Failed to fetch item');
                return response.json();
            });
            
            const itemsData = await Promise.all(itemPromises);
            //console.log('Fetched items:', itemsData);
            setItems(itemsData);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const fetchModifiers = async () => {
        try {
            const allModifiersMap = new Map<number, Modifier>(); // Use a Map to deduplicate modifiers by ID
            
            for (const item of cartItems) {
                const cartModifiers = item.modifiers;
    
                if (!cartModifiers || cartModifiers.length === 0) {
                    console.warn('No modifiers found for item:', item);
                    continue;
                }
    
                const response = await fetch(`/api/modifiers/${item.menu_item_id}`);
                if (!response.ok) throw new Error('Failed to fetch modifiers');
                const modifiers = await response.json();
    
                if (!modifiers || modifiers.length === 0) {
                    console.warn('No modifiers data returned for item:', item.menu_item_id);
                    continue;
                }
    
                // Flatten the modifier options for this cart item
                const allModifierOptions = cartModifiers.flatMap((modifier) => modifier.modifier_options || []);
    
                //console.log('allModifierOptions', allModifierOptions);
                const mergedModifiers = modifiers.map((modifier: Modifier) => {
                    console.log('modifier', modifier);
                    console.log('allModifierOptions', allModifierOptions)
                    const modifierOptions = allModifierOptions.filter(
                        (option) => option.modifier_id === modifier.id
                    );
                    console.log('modifierOptions', modifierOptions);
                    return {
                        ...modifier,
                        modifier_options: modifierOptions.map((option) => ({
                            id: option.id,
                            name: modifier.modifier_options.find((modOpt) => modOpt.id === option.modifier_option_id)?.name, // Ensure the 'name' field exists
                            modifier_option_id: option.modifier_option_id,
                            modifier_id: option.modifier_id,
                            created_at: option.created_at,
                        })),
                    };
                });
    
                console.log('mergedModifiers', mergedModifiers); // Debug merged modifiers
    
                // Add each merged modifier to the Map, overwriting duplicates
                for (const modifier of mergedModifiers) {
                    allModifiersMap.set(modifier.id, modifier);
                }
            }
    
            // Convert the Map back to an array and update state
            const allModifierData = Array.from(allModifiersMap.values());
            setAllModifiers(allModifierData); // Update state with the deduplicated array
        } catch (error) {
            console.error('Error fetching modifiers:', error);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Shopping Cart</h1>
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="lg:col-span-7">
                    <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                    <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                        {items.map(({item}) => {
                            return(
                            <li key={item.id} className="flex py-6 sm:py-10">
                                <div className="flex-shrink-0">
                                    <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[0]}`} alt="" className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48" />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm">
                                                    <a href="#" className="font-medium hover:text-red-500">{item.name}</a>
                                                </h3>
                                            </div>
                                            <div className="mt-1 text-sm">
                                            {allModifiers.map((modifier) => (
                                                <div key={modifier.id} className="modifier">
                                                    <h2>{modifier.name}</h2>
                                                    {cartItems.find((cartItem) => cartItem.id === item.id)?.modifier_options.length > 0 ? (
                                                        <ul>
                                                            {modifier.modifier_options.map((option) => {
                                                                //console.log('option', option);
                                                                return (
                                                                <li key={option.id}>
                                                                    {option.name}
                                                                </li>
                                                            )})}
                                                        </ul>
                                                    ) : (
                                                        <p>No options available for this modifier.</p>
                                                    )}
                                                </div>
                                            ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                        <p className="mt-1 text-sm font-medium">${item.price.toFixed(2)}</p>

                                            <label htmlFor="quantity-0" className="sr-only">Quantity, Basic Tee</label>
                                            <select id="quantity-0" name="quantity-0" className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                            </select>
                                            <div className="absolute right-0 top-0">
                                                <button type="button" className="-m-2 inline-flex p-2 text-white hover:text-red-500">
                                                    <span className="sr-only">Remove</span>
                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )})} 
                    </ul>
                </section>
                <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                    <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">$99.00</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="flex items-center text-sm text-gray-600">
                                <span>Delivery estimate</span>
                                <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500">
                                    <span className="sr-only">Learn more about how shipping is calculated</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path 
                                            fillRule="evenodd" 
                                            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                </a>
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="flex text-sm text-gray-600">
                                <span>Tax estimate</span>
                                <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500">
                                    <span className="sr-only">Learn more about how tax is calculated</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path 
                                            fillRule="evenodd" 
                                            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" 
                                            clipRule="evenodd" />
                                    </svg>
                                </a>
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">$8.32</dd>
                        </div>    
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">Order total</dt>
                            <dd className="text-base font-medium text-gray-900">$112.32</dd>
                        </div>
                    </dl>
                    <div className="mt-6">
                        <button onClick={handleClick} type="button" className="w-full rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50">Checkout</button>
                    </div>
                </section>
            </form>
        </div>
    )

}

export default CartPage