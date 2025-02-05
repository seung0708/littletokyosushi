'use client'
import { useCart } from "@/app/context/cartContext";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { CartItem } from "@/types/cart";
import {useRouter} from 'next/navigation';


const CartPage: React.FC = () => {
    const { cartItems, handleCartUpdate, removeItemFromCart} = useCart(); 
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/checkout');
        
    }

    const calculateTotalPrice = (basePrice: number, quantity: number, modifiers: any) => {
        const modifierPrice = modifiers.reduce((total: number, mod: any) => {
            return total + mod.cart_item_modifier_options.reduce((optTotal: number, opt: any) => optTotal + opt.price, 0);
        }, 0);

        
        return (basePrice + modifierPrice) * quantity;
    };
    
    const handleQuantityChange = async (cartItem: CartItem, increment: boolean) => {
        const newQuantity = increment ? cartItem.quantity + 1 : cartItem.quantity - 1;

        const updatedItem = {
            cart_item_id: cartItem.id,
            quantity: newQuantity,
            base_price: cartItem.base_price,
            total_price: calculateTotalPrice(cartItem.base_price, newQuantity, cartItem.cart_item_modifiers), 
            special_instructions: cartItem.special_instructions, 
            menu_item_name: cartItem.menu_item_name,
            menu_item_image: cartItem.menu_item_image, 
            cart_item_modifiers: cartItem.cart_item_modifiers
        };
        await handleCartUpdate(updatedItem);

    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="w-full bg-black pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Your Cart</h1>
                        <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-300">
                            Review your selected items
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {!cartItems || cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-400">Your cart is empty.</p>
                        <Button 
                            onClick={() => router.push('/menu')}
                            className="mt-6 bg-red-600 hover:bg-red-700 text-white"
                        >
                            View Menu
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="lg:col-span-7">
                            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                            <div className="space-y-6">
                                {cartItems.map((cartItem) => (
                                    <div key={cartItem.id} 
                                         className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                                  border border-white/10 rounded-xl overflow-hidden">
                                        <div className="flex p-6">
                                            <div className="relative h-24 w-24 sm:h-48 sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
                                                <img 
                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${cartItem.menu_item_image}`} 
                                                    alt={cartItem.menu_item_name} 
                                                    className="h-full w-full object-cover object-center" 
                                                />
                                            </div>
                                            <div className="ml-6 flex flex-1 flex-col">
                                                <div className="flex justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-bold">{cartItem.menu_item_name}</h3>
                                                        {cartItem.cart_item_modifiers?.map(modifier => (
                                                            <div key={modifier.id} className="space-y-1">
                                                                <h4 className="text-sm font-medium text-gray-300">{modifier.name}</h4>
                                                                {modifier.cart_item_modifier_options && modifier.cart_item_modifier_options.length > 0 && (
                                                                    <ul className="space-y-1">
                                                                        {modifier.cart_item_modifier_options.map((option: any) => (
                                                                            <li key={option.id} 
                                                                                className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-full inline-block mr-2">
                                                                                {option.name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-2">
                                                        <p className="text-lg font-bold text-red-400">
                                                            ${calculateTotalPrice(
                                                                cartItem.base_price,
                                                                cartItem.quantity,
                                                                cartItem.cart_item_modifiers || []
                                                            ).toFixed(2)}
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            onClick={() => removeItemFromCart(cartItem.id || '')}
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
                                                            disabled={cartItem.quantity <= 1}
                                                            onClick={() => handleQuantityChange(cartItem, false)}
                                                        >
                                                            <MinusIcon className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-8 text-center">{cartItem.quantity}</span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-black/30"
                                                            onClick={() => handleQuantityChange(cartItem, true)}
                                                        >
                                                            <PlusIcon className="h-4 w-4" />
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
                                 className="mt-16 rounded-xl bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                          border border-white/10 px-6 py-6 sm:p-8 lg:col-span-5 lg:mt-0 lg:p-8">
                            <h2 id="summary-heading" className="text-lg font-medium">Order Summary</h2>
                            <dl className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-300">Subtotal</dt>
                                    <dd className="text-sm font-medium">
                                        ${cartItems.reduce((total, item) => 
                                            total + calculateTotalPrice(
                                                item.base_price,
                                                item.quantity,
                                                item.cart_item_modifiers || []
                                            ), 0).toFixed(2)}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <dt className="text-base font-medium">Order total</dt>
                                    <dd className="text-xl font-bold text-red-400">
                                        ${cartItems.reduce((total, item) => 
                                            total + calculateTotalPrice(
                                                item.base_price,
                                                item.quantity,
                                                item.cart_item_modifiers || []
                                            ), 0).toFixed(2)}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-6">
                                <Button 
                                    type="submit"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </section>
                    </form>
                )}
            </div>
        </div>
    );
}
export default CartPage