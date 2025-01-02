'use client'
import { useCart } from "../../context/cartContext";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { CartItem } from "@/types/cart";


const CartPage: React.FC = () => {
    const { cartItems, handleCartUpdate, removeItemFromCart} = useCart(); 
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('cartItems', cartItems)
        
    }

    const calculateTotalPrice = (basePrice: number, quantity: number, modifiers) => {
        console.log('modifiers', modifiers)
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
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shopping Cart</h1>
            {!cartItems || cartItems.length === 0 ? (
                <p className="mt-12 text-center text-sm text-gray-500">Your cart is empty.</p>
            ) : (
                <form onSubmit={onSubmit} className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
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
                                                    <h2 className="font-bold">{cartItem.menu_item_name}</h2>
                                                    <div className="mt-1 w-72 flex gap-4">
                                                        {cartItem.cart_item_modifiers?.map(modifier => (
                                                            <div className="w-full" key={modifier.id} >
                                                                <h3 className="text-sm">{modifier.name}</h3>
                                                                {modifier.cart_item_modifier_options && modifier.cart_item_modifier_options.length > 0 ? (
                                                                    <ul>
                                                                        {modifier.cart_item_modifier_options.map((option: any) => (
                                                                            <li className="text-xs text-gray-500" key={option.id}>{option.name}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : null}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm">Special Instructions</h3> 
                                                        <p className="text-gray-500 text-xs">{cartItem.special_instructions === '' ? 'None' : cartItem.special_instructions}</p>
                                                    </div>
                                                </div>
                                                
                                            
                                                <div className="mt-4 sm:mt-0">
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-x-2 mb-2">
                                                            <p className="font-medium text-gray-900">
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
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="inline-flex p-2 hover:bg-white"
                                                                onClick={() => removeItemFromCart(cartItem.id)}
                                                                
                                                            >
                                                                <span className="sr-only">Remove</span>
                                                                <TrashIcon className="h-5 w-5 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-6 w-6"
                                                                disabled={cartItem.quantity <= 1}
                                                                onClick={() => handleQuantityChange(cartItem, false)}
                                                            >
                                                                <MinusIcon className="h-3 w-3" />
                                                            </Button>
                                                            <span>{cartItem.quantity}</span>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-6 w-6"
                                                                onClick={() => handleQuantityChange(cartItem, true)}
                                                            >
                                                                <PlusIcon className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    
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
                                    type="submit" 
                                    className="w-full rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50" 
                                    
                                >
                                    Checkout
                                </Button>
                            </div>
                        </section>
                    </form>
            )}
        </div>
    );
}
export default CartPage