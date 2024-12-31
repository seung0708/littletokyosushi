'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { CartItem, Cart, CartItemModifier, CartItemModifierOption } from "@/types/cart";


interface CartContextType {
    cartItems: CartItem[];
    cartId: string;
    addItemToCart: (item: CartItem) => Promise<void>;
    updateCart: (item: CartItem) => Promise<void>;
    removeItemFromCart: (item: CartItem) => Promise<void>;
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
    let userId = user?.id;
    console.log(user, userId);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string>("");
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);
    const [cartSuccess, setCartSuccess] = useState<string | null>(null);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        const storedCartId = localStorage.getItem('cartId');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
        if (storedCartId) {
            setCartId(storedCartId);
        }
    },[]);

    const fetchCart = async () => {
        try {
            setIsCartLoading(true);
            setCartError(null);
            //console.log('Fetching cart...');
            const cartId = localStorage.getItem('cartId');
            if(cartId) {
                //console.log('Fetching cart:', cartId);
                const response = await fetch(`/api/store/cart/${cartId}`);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to fetch cart');
                }
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to fetch cart');
        } finally {
            setIsCartLoading(false);
        }
    };

    

    const addItemToCart = async (item: CartItem) => {
        console.log(userId)
        try {
            setIsCartLoading(true);
            setCartError(null);
            if(!userId) {
                if(!cartId || cartId === '') {
                    const response = await fetch('/api/store/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            items: [item],
                            customer_id: userId,
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json(); 
                    //console.log(data);
                    setCartId(data.cartId);
                    localStorage.setItem('cartId', data.cartId);
                    if (data.status = 200) {
                        const cart = await fetchCart();
                        //console.log(cart);
                        setCartItems(cart.cart_items);
                        localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
                    }

                } 
                else {
                    //console.log('Updating cart...');
                    const response = await fetch(`/api/store/cart/${cartId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            cart_items: [...cartItems, item],
                            customer_id: userId
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json();
                    //console.log(data);
                    setCartSuccess(data.message);
                    if(data.status === 200) {
                        const cart = await fetchCart();
                        console.log(cart);
                        setCartItems(cart.cart_items);
                        localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
                    }
                }
            } 
            else { 
                if(!cartId) {
                    const response = await fetch('/api/store/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            items: [...cartItems, item], 
                            customer_id: userId
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json(); 
                    //console.log(data);
                    setCartId(data.cartId);
                    localStorage.setItem('cartId', data.cartId);
                    if (data.status = 200) {
                        const cart = await fetchCart();
                        //console.log(cart);
                        setCartItems(cart.cart_items);
                        localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
                    }
                } else {
                    const response = await fetch(`/api/store/cart/${cartId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify({
                            cart_items: [...cartItems, item],
                            customer_id: userId
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json();
                    //console.log(data);
                    setCartSuccess(data.message);
                    if(data.status === 200) {
                        const cart = await fetchCart();
                        console.log(cart);
                        setCartItems(cart.cart_items);
                        localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
                    }
                }
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to add item to cart');
            throw error;
        } finally {
            setIsCartLoading(false);
        }
    };

    const updateCart = async (updatedItem: CartItem) => {
        try {
            setIsCartLoading(true);
            setCartError(null);

            // Get previous state before update
            const previousCartItems = cartItems;

            // Update the database
            const response = await fetch(`/api/store/cart/${cartId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_items: [updatedItem],
                    customer_id: userId
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                // Revert to previous state if update fails
                setCartItems(previousCartItems);
                localStorage.setItem('cartItems', JSON.stringify(previousCartItems));
                throw new Error(error.error || 'Failed to update cart');
            }

            const data = await response.json();
            console.log(data);
            setCartSuccess(data.message);
            if(data.status === 200) {
                const cart = await fetchCart();
                //console.log(cart);
                setCartItems(cart.cart_items);
                localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
            }

        } catch (error) {
            console.error('Error updating cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to update cart');
        } finally {
            setIsCartLoading(false);
        }
    };

    const removeItemFromCart = async (cartItem: CartItem) => {
        const response = await fetch(`/api/store/cart/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                cartItem
            ),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove item from cart');
        }
        const data = await response.json();
        console.log(data);
        setCartSuccess(data.message);
        if(data.status === 200) {
            const cart = await fetchCart();
            console.log(cart);
            setCartItems(cart.cart_items);
            localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartId,
            addItemToCart,
            updateCart,
            removeItemFromCart,
            isCartLoading,
            cartError,
        }}>
            {children}
        </CartContext.Provider>
    );
};
