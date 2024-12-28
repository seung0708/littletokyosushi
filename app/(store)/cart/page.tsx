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
    const { cartItems, updateCart, removeFromCart } = useCart(); 
    console.log('cartItems', cartItems)
    const router = useRouter();

    const minQuantity = cartItems.length > 0 ? cartItems[0].quantity : 1;
    const maxQuantity = 10;

    const getItemQuantity = (cartId: string) => {
        return cartItems.find(item => item.cart_id === cartId)?.quantity || 1;
    };

    const getItemBasePrice = (cartId: string) => {
        return cartItems.find(item => item.cart_id === cartId)?.base_price || 0;
    };

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
        const refreshCartItems = async () => {
            if (cartItems.length > 0) {
                const cartResponse = await fetch(`/api/store/cart/${cartItems[0].cart_id}`);
                if (cartResponse.ok) {
                    const freshCartItems = await cartResponse.json();
                    localStorage.setItem('cartItems', JSON.stringify(freshCartItems));
                    window.dispatchEvent(new Event('storage')); // Trigger cart context update
                }
            }
        };
        refreshCartItems();
    }, [cartItems]);

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
            // Get fresh cart items from database
            const cartResponse = await fetch(`/api/store/cart/${cartItems[0].cart_id}`);
            if (!cartResponse.ok) throw new Error('Failed to fetch cart items');
            const dbCartItems = await cartResponse.json();

            // Fetch modifiers for each cart item
            const modifierPromises = dbCartItems.map(async (item) => {
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
            quantity: data.quantity,
            total_price: item.base_price * data.quantity
        }));

        for (const item of updatedCartItems) {
            await updateCart(item);
        }
        router.push('/checkout');
    }
    
    const handleQuantityChange = async (cartItem: CartItem, newQuantity: number) => {
        try {
            const newTotalPrice = cartItem.base_price * newQuantity;
            
            await updateCart({
                ...cartItem,
                quantity: newQuantity,
                total_price: newTotalPrice
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shopping Cart</h1>
        <Form {...form}>
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="lg:col-span-7">
                    <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                    <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                        
                            <li className="flex py-6 sm:py-10">
                                <div className="flex-shrink-0">
                                    <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/`} alt="" className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48" />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm">
                                                    <p className="font-medium text-gray-700 hover:text-gray-800">
                                                       
                                                    </p>
                                                </h3>
                                            </div>
                                            
                                            {/* {cartItems.map(cartItem => {
                                            <div className="mt-1 text-sm">
                                                {cartItem.modifiers?.map(modifier => (
                                                    <div key={modifier.id} className="modifier">
                                                        <h2>{modifier.name}</h2>
                                                        {modifier.modifier_options && modifier.modifier_options.length > 0 ? (
                                                            <ul>
                                                                {modifier.modifier_options.map((option: any) => (
                                                                    <li key={option.id}>{option.name}</li>
                                                                ))}
                                                            </ul>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </div>
                                            })}*/}
                                        </div> 

                                        {/* <div className="mt-4 sm:mt-0">
                                            <div className="absolute right-0 top-0">
                                                <Button
                                                    variant="ghost"
                                                    className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={() => removeFromCart(cartItem)}
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    {/* <XMarkIcon className="h-5 w-5" aria-hidden="true" /> 
                                                </Button>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="mb-2 text-sm font-medium">
                                                    ${(cartItem.base_price * cartItem.quantity).toFixed(2)}
                                                </p>
                                                <FormField
                                                    control={form.control}
                                                    name="quantity"
                                                    defaultValue={cartItem.quantity}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex items-center space-x-4">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-6 w-6"
                                                                    disabled={cartItem.quantity <= 1}
                                                                    onClick={async () => {
                                                                        try {
                                                                            const newQuantity = Math.max(1, cartItem.quantity - 1);
                                                                            const newTotalPrice = cartItem.base_price * newQuantity;
                                                                            
                                                                            await updateCart({
                                                                                ...cartItem,
                                                                                quantity: newQuantity,
                                                                                total_price: newTotalPrice
                                                                            });

                                                                            // Update form value after successful API call
                                                                            field.onChange(newQuantity);
                                                                        } catch (error) {
                                                                            console.error('Error updating quantity:', error);
                                                                        }
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
                                                                    disabled={cartItem.quantity >= 10}
                                                                    onClick={async () => {
                                                                        try {
                                                                            const newQuantity = Math.min(10, cartItem.quantity + 1);
                                                                            const newTotalPrice = cartItem.base_price * newQuantity;
                                                                            
                                                                            await updateCart({
                                                                                ...cartItem,
                                                                                quantity: newQuantity,
                                                                                total_price: newTotalPrice
                                                                            });

                                                                            // Update form value after successful API call
                                                                            field.onChange(newQuantity);
                                                                        } catch (error) {
                                                                            console.error('Error updating quantity:', error);
                                                                        }
                                                                    }}
                                                                >
                                                                    <PlusIcon className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </li>
                       
                    </ul>
                </section>
                <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">Sub Total</dt>
                            <dd className="text-base font-medium text-gray-900">${cartItems.reduce((total, item) => total + item.base_price * item.quantity, 0).toFixed(2)}</dd>
                        </div>
                    </dl>
                    <div className="mt-6">
                        <Button type="button" className="w-full rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50" onClick={form.handleSubmit(onSubmit)}>Checkout</Button>
                    </div>
                </section>
            </form>
        </Form>
    </div>
    
    )

}

export default CartPage