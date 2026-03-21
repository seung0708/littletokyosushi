'use client'
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/cartContext";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { CartItem, CartItemModifier, CartItemModifierOption } from "@/types/cart";

import { calculateTotalPrice } from '@/utils/item';
import Image from "next/image";
import { Loading } from "@/components/ui/loading";
import { CheckoutButton} from '@/components/ui/loadingButtons';
import {useToast} from '@/app/context/toastContext';
import { EmptyCart } from "@/components/store/emptyStates";
import { useBackButton } from '@/app/hooks/useBackButton';


export default function CartContainer() {

    const { cartItems, handleCartUpdate, removeItemFromCart } = useCart(); 
    const { showToast } = useToast();
    const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({})
    const [loadingRemoval, setLoadingRemoval] = useState<Record<string, boolean>>({})
    const [isCheckingout, setIsCheckout] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const router =  useBackButton(() => {
        if(isCheckingout) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
            if(!confirmed) {
                window.history.pushState(null, '', window.location.href);
                return;
            }
        }
    })
    
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsCheckout(true);
            setError(null);
            
            if(!cartItems.length) {
                setError('Your cart is empty.');
                return;
            }

            await router.push('/checkout');
        } catch (error) {
            setError('Failed to checkout. Please try again.');
        }
        finally {
            setIsCheckout(false);
        }
    }

    const handleQuantityChange = async (cartItem: CartItem, increment: boolean) => {
        if (!cartItem.id) return;
        try {
            setLoadingItems(prev => ({ ...prev, [cartItem.id!]: true }));
            setError(null);
    
            const newQuantity = increment ? cartItem.quantity + 1 : cartItem.quantity - 1;

            const updatedItem = {
                cart_item_id: cartItem.id,
                quantity: newQuantity,
                base_price: cartItem.base_price,
                total_price: calculateTotalPrice(cartItem.base_price, newQuantity, cartItem.cart_item_modifiers || []), 
                special_instructions: cartItem.special_instructions, 
                menu_items: {
                    name: cartItem.menu_items?.name || '',
                    image_url: cartItem.menu_items?.image_urls
                },
                cart_item_modifiers: cartItem.cart_item_modifiers
            };
        
            await handleCartUpdate(updatedItem);
            showToast('Cart updated successfully', 'success');
        } catch (error) {
            setError('Failed to update quantity. Please try again.')
            showToast('Failed to update cart', 'error');
        }
        finally {
            setLoadingItems(prev => ({ ...prev, [cartItem.id!]: false }));
        }
    }

    const handleRemoveItem = async (itemId: string) => {
        try {
            setLoadingRemoval(prev => ({...prev, [itemId]: true}));
            setError(null);

            await removeItemFromCart(itemId);
            showToast('Item removed from cart', 'success');
        }
        catch (error) {
            setError('Failed to remove item. Please try again.');
            showToast('Failed to remove item from cart', 'error');
        }
        finally {
            setLoadingRemoval(prev => ({...prev, [itemId]: false}));
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!mounted ? (
                <div className="flex items-center justify-center py-16">
                    <Loading className="w-8 h-8" variant="store" />
                </div>
            ) : (
                <div>
                    {error && (
                        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}
                    {!cartItems || cartItems.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <form onSubmit={onSubmit} className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
                            <section aria-labelledby="cart-heading" className="lg:col-span-7">
                                <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                                <div className="space-y-6">
                                {cartItems.map((cartItem) => (
                                    <div key={cartItem.id} className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                                        <div className="flex p-6">
                                            <div className="relative h-24 w-24 sm:h-48 sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
                                                <Image
                                                    src={`${cartItem?.menu_items?.image_urls?.[0]}`} 
                                                    alt={cartItem?.menu_items?.name || 'Item image'} 
                                                    //className="h-full w-full object-cover object-center" 
                                                    fill={true}
                                                    sizes="h-full w-full"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="ml-6 flex flex-1 flex-col">
                                                <div className="flex justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-bold">{cartItem?.menu_items?.name}</h3>
                                                        {cartItem?.cart_item_modifiers?.map((modifier: CartItemModifier) => (
                                                            <div key={modifier.id} className="space-y-1">
                                                                <h4 className="text-sm font-medium text-gray-300">{modifier?.modifiers?.name}</h4>
                                                                {modifier?.cart_item_modifier_options && modifier?.cart_item_modifier_options?.length > 0 && (
                                                                    <ul className="space-y-1">
                                                                    {modifier.cart_item_modifier_options.map((option: CartItemModifierOption) => (
                                                                        <li key={option.id} className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-full mr-2">
                                                                            {option.modifier_options?.name} +{option.modifier_options?.price.toFixed(2)}
                                                                        </li>
                                                                    ))}
                                                                    </ul>
                                                                )}
                                                                    
                                                            </div>
                                                        ))}
                                                        {cartItem?.special_instructions && (
                                                            <>
                                                                <h4 className="text-sm font-medium text-gray-300">Special Instructions</h4>
                                                                <p className="text-xs text-gray-400">{cartItem?.special_instructions}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-2">
                                                        <p className="text-lg font-bold text-red-400">
                                                            ${calculateTotalPrice( cartItem.base_price, cartItem.quantity, cartItem.cart_item_modifiers || []).toFixed(2)}
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            disabled={loadingItems[cartItem.id!]}
                                                            onClick={() => handleRemoveItem(cartItem.id!)}
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center">
                                                    <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-black/30"
                                                            disabled={cartItem.quantity <= 1 || loadingItems[cartItem.id!]}
                                                            onClick={() => handleQuantityChange(cartItem, false)}
                                                        >
                                                            {loadingItems[cartItem.id!] ? (
                                                                <Loading size="sm" variant="store" />
                                                            ) : (
                                                                <MinusIcon className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                            <span className="w-8 text-center">{cartItem.quantity}</span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-black/30"
                                                            disabled={loadingItems[cartItem.id!]}
                                                            onClick={() => handleQuantityChange(cartItem, true)}
                                                        >
                                                            {loadingItems[cartItem.id!] ? (
                                                                <Loading size="sm" variant="store" />
                                                            ) : (
                                                                <PlusIcon className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </section>
                            <section aria-labelledby="summary-heading" 
                                className="mt-16 rounded-xl bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 px-6 py-6 sm:p-8 lg:col-span-5 lg:mt-0 lg:p-8">
                                <h2 id="summary-heading" className="text-lg font-medium">Order Summary</h2>
                                <dl className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-300">Subtotal</dt>
                                        <dd className="text-sm font-medium">
                                            ${cartItems.reduce((total, item) => total + calculateTotalPrice( item.base_price, item.quantity, item.cart_item_modifiers || [] ), 0).toFixed(2)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <dt className="text-base font-medium">Order total</dt>
                                        <dd className="text-xl font-bold text-red-400">
                                            ${cartItems.reduce((total, item) => total + calculateTotalPrice( item.base_price, item.quantity, item.cart_item_modifiers || [] ), 0).toFixed(2)}
                                        </dd>
                                    </div>
                                </dl>
                                <div className="mt-6">
                                    <CheckoutButton 
                                        type="submit"
                                        isLoading={isCheckingout}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                                    >
                                        Proceed to Checkout
                                    </CheckoutButton>
                                </div>
                            </section>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}