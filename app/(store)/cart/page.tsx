'use client'
import { useEffect, useState } from "react";
import { useCart, CartItem } from "../../context/cartContext";
import { useRouter } from "next/navigation"
import { Modifier } from "@/types/definitions";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";



const CartPage: React.FC = () => {
    const [items, setItems] = useState([])
    const [allModifiers, setAllModifiers] = useState<Modifier[][]>([])
    console.log('allModifiers', allModifiers)
    const { cartItems} = useCart(); 
    //console.log('cartItems', cartItems)
    const router = useRouter();

    const minQuantity = cartItems.length > 0 ? cartItems[0].quantity : 1;

    const formSchema = z.object({
        quantity: z.number().min(minQuantity),
    })

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: minQuantity
        }
    })

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
            // Fetch modifiers for each cart item
            const modifierPromises = cartItems.map(async (item) => {
                const response = await fetch(`/api/modifiers/${item.menu_item_id}`);
                if (!response.ok) throw new Error(`Failed to fetch modifiers for item ${item.menu_item_id}`);
                const fetchedModifierData = await response.json();
                
                if (!item.modifiers) {
                    return {
                        ...item,
                        modifiers: []
                    };
                }

                // Map through the item's selected modifiers
                const updatedModifiers = item.modifiers.map(selectedMod => {
                    // Find the full modifier data using modifier_id
                    const fullModifier = fetchedModifierData.find(mod => mod.id === selectedMod.modifier_id);
                    if (!fullModifier) return selectedMod;

                    // Map the selected modifier options
                    const updatedOptions = selectedMod.modifier_options.map(option => {
                        // Find the full option data from the fetched modifier
                        const fullOption = fullModifier.modifier_options.find(
                            opt => opt.id === option.modifier_option_id
                        );
                        
                        return {
                            ...option,
                            name: fullOption?.name || 'Unknown Option',
                            price: fullOption?.price || 0
                        };
                    });

                    // Return the modifier with the full data
                    return {
                        ...selectedMod,
                        name: fullModifier.name,
                        min_selections: fullModifier.min_selections,
                        max_selections: fullModifier.max_selections,
                        is_required: fullModifier.is_required,
                        modifier_options: updatedOptions
                    };
                });

                return {
                    ...item,
                    modifiers: updatedModifiers
                };
            });

            const fetchedModifiers = await Promise.all(modifierPromises);
            console.log('Fetched modifiers:', fetchedModifiers);
            setAllModifiers(fetchedModifiers);
        } catch (error) {
            console.error('Error fetching modifiers:', error);
        }
    };
    
    
    const onSubmit = async (data: FormData) => {
        const updatedCartItems = cartItems.map(item => ({
            ...item,
            quantity: data.quantity
        }));
        //console.log('updatedCartItems', updatedCartItems);
        await updateCart(updatedCartItems);
        router.push('/checkout');
    }
    
    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shopping Cart</h1>
        <Form {...form}>
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
                                            {allModifiers.find(cartItem => cartItem.menu_item_id === item.id && cartItem.modifiers.length > 0)?.modifiers.map(modifier => (
                                                <div key={modifier.id} className="modifier">
                                                    <h2>{modifier.name}</h2>
                                                    {modifier.modifier_options && modifier.modifier_options.length > 0 ? (
                                                        <ul>
                                                            {modifier.modifier_options.map((option) => (
                                                                <li key={option.id}>
                                                                    {option.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No options available for this modifier.</p>
                                                    )}
                                                </div>
                                            ))}
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                            <div className="flex flex-col items-end">
                                            {cartItems && cartItems.some(cartItem => cartItem.menu_item_id === item.id) && (
                                                    <>
                                                        {cartItems
                                                            .filter(cartItem => cartItem.menu_item_id === item.id)
                                                            .slice(0, 1) // Ensure only one match is rendered
                                                            .map(cartItem => (
                                                                <div key={cartItem.menu_item_id}>
                                                                    <p className="mb-2 text-sm font-medium">
                                                                        ${cartItem.base_price.toFixed(2)}
                                                                    </p>
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="quantity"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <div className="flex items-center space-x-4">
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="h-6 w-6"
                                                                                        onClick={() => {
                                                                                            const newQuantity = Math.max(1, cartItem.quantity - 1);
                                                                                            form.setValue('quantity', newQuantity);
                                                                                        }}
                                                                                    >
                                                                                        <MinusIcon className="h-3 w-3" />
                                                                                    </Button>
                                                                                    <span className="text-sm font-medium">{cartItem.quantity}</span>
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="h-6 w-6"
                                                                                        onClick={() => {
                                                                                            const newQuantity = cartItem.quantity + 1;
                                                                                            form.setValue('quantity', newQuantity);
                                                                                        }}
                                                                                    >
                                                                                        <PlusIcon className="h-3 w-3" />
                                                                                    </Button>
                                                                                </div>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )})} 
                    </ul>
                </section>
                <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">Sub Total</dt>
                            <dd className="text-base font-medium text-gray-900">{cartItems.reduce((total, item) => total + item.base_price * item.quantity, 0).toFixed(2)}</dd>
                        </div>
                    </dl>
                    <div className="mt-6">
                        <Button type="button" className="w-full rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50">Checkout</Button>
                    </div>
                </section>
            </form>
        </Form>
    </div>
    
    )

}

export default CartPage

{/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
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
                        </div>     */}