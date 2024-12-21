'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

export interface CartItem  {
    cart_id?: string;
    menu_item_id: number
    quantity: number;
    base_price: number;
    total_price: number;
    modifiers: CartItemModifier[];
};

export interface CartItemModifier  {
    id: number;
    name: string;
    min_selections: number;
    max_selections: number;
    is_required: boolean;
    modifier_options: CartItemModifierOption[];
};

export interface CartItemModifierOption {
    id: number;
    name: string;
    price: number;
};

interface CartContextType {
    cartItems: CartItem[];
    cartId: string | null;
    addItemToCart: (item: CartItem) => Promise<void>;
    isCartLoading: boolean;
    cartError: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const { user } = useAuth();
    let customerId = user?.id;
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string | null>(null);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);

    const fetchCart = async () => {
        try {
            setIsCartLoading(true);
            setCartError(null);
            if(cartId) {
                const response = await fetch(`/api/store/cart/${cartId}`);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to fetch cart');
                }
                const data = await response.json();

                setCartId(data.cart_id);
                setCartItems(data.cart_items || []);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to fetch cart');
        } finally {
            setIsCartLoading(false);
        }
    };

    const addItemToCart = async (item: CartItem) => {
        console.log('Adding item to cart:', item);
        try {
            setIsCartLoading(true);
            setCartError(null);
            if(!customerId) { 
                if(!cartId) {
                    console.log('No cart ID');
                    const response = await fetch('/api/store/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            cart_items: [...cartItems, item],
                            customer_id: customerId,
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json();
                    console.log(data);
                    setCartId(data.id);
                    setCartItems(data.cart_items.push(item) || []);
                    console.log(cartId, cartItems);

                } 
                else {
                    const response = await fetch(`/api/store/cart/${cartId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            cart_items: [...cartItems, item]
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json();
                    setCartItems(data.cart_items || []);
                }
            } 
            // else { 
            //     if(!cartId) {
            //         const response = await fetch('/api/store/cart', {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 cart_items: [...cartItems, item], 
            //                 customer_id: customerId
            //             }),
            //         });
            //         if (!response.ok) {
            //             const error = await response.json();
            //             throw new Error(error.error || 'Failed to add item to cart');
            //         }
            //         const data = await response.json();
            //         setCartId(data.cart_id);
            //         setCartItems(data.cart_items || []);
            //     } else {
            //         const response = await fetch(`/api/store/cart/${cartId}`, {
            //             method: 'PATCH',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             }, 
            //             body: JSON.stringify({
            //                 cart_items: [...cartItems, item],
            //                 customer_id: customerId
            //             }),
            //         });
            //         if (!response.ok) {
            //             const error = await response.json();
            //             throw new Error(error.error || 'Failed to add item to cart');
            //         }
            //         const data = await response.json();
            //         setCartItems(data.cart_items || []);
            //     }
            // }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to add item to cart');
            throw error;
        } finally {
            setIsCartLoading(false);
        }
};

    useEffect(() => {   
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartId,
            addItemToCart,
            isCartLoading,
            cartError,
        }}>
            {children}
        </CartContext.Provider>
    );
};