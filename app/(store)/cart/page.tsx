'use client'
import { useEffect, useState } from "react";
import { useCart } from "../../context/cartContext";
import { useRouter } from "next/navigation"
import { Modifier } from "@/types/definitions";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";




const CartPage: React.FC = () => {
    const [allModifiers, setAllModifiers] = useState<Modifier[][]>([])
    console.log('allModifiers', allModifiers)
    const { cartItems, updateCart} = useCart(); 
    console.log('cartItems', cartItems)
    const router = useRouter();


    const formSchema = z.object({
        quantity: z.number().min(1),
    })

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1
        }
    })

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
    
    const handleQuantityChange = async (newQuantity: number) => {
        try {
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
                            {cartItems.map((cartItem) => (
                                <li key={cartItem.id} className="flex py-6 sm:py-10">
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${cartItem.menu_item_image}`} 
                                            alt={cartItem.menu_item_name} 
                                            className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48" 
                                        />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <p className="font-medium text-gray-700 hover:text-gray-800">
                                                            {cartItem.menu_item_name}
                                                        </p>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 text-sm">
                                                    {cartItem.cart_item_modifiers?.map(modifier => (
                                                        <div key={modifier.id} className="modifier">
                                                            <h2>{modifier.name}</h2>
                                                            {modifier.cart_item_modifier_options && modifier.cart_item_modifier_options.length > 0 ? (
                                                                <ul>
                                                                    {modifier.cart_item_modifier_options.map((option: any) => (
                                                                        <li key={option.id}>{option.name}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : null}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:mt-0">
                                                <div className="absolute right-0 top-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="inline-flex p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => {}}
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <p className="mb-2 text-sm font-medium text-gray-900">
                                                    ${
                                                        (
                                                            cartItem.base_price * cartItem.quantity + 
                                                            (cartItem.cart_item_modifiers?.reduce((total: number, modifier: any) => {
                                                                const modifierTotal = modifier.cart_item_modifier_options?.reduce(
                                                                    (subTotal: number, option: any) => subTotal + (option.price || 0), 0) || 0; 
                                                                    return total + modifierTotal;
                                                                }, 0) || 0
                                                        ) 
                                                        ).toFixed(2)
                                                    }
                                                    </p>
                                                    <FormField
                                                        control={form.control}
                                                        name="quantity"
                                                        render={({ field }) => (
                                                            <div className="flex items-center space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-6 w-6"
                                                                    disabled={cartItem.quantity <= 1}
                                                                    onClick={() => {}}
                                                                >
                                                                    <MinusIcon className="h-3 w-3" />
                                                                </Button>
                                                                <span>{cartItem.quantity}</span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-6 w-6"
                                                                    disabled={cartItem.quantity >= 10}
                                                                    onClick={() => {}}
                                                                >
                                                                    <PlusIcon className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="text-base font-medium text-gray-900">Sub Total</dt>
                                <dd className="text-base font-medium text-gray-900">
                                    ${cartItems.reduce((total, item) => total + item.base_price * item.quantity, 0).toFixed(2)}
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-6">
                            <Button 
                                type="button" 
                                className="w-full rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50" 
                                onClick={form.handleSubmit(onSubmit)}
                            >
                                Checkout
                            </Button>
                        </div>
                    </section>
                </form>
            </Form>
        </div>
    );
}
export default CartPage