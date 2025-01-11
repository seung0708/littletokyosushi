'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { CartItem, Cart, CartItemModifier, CartItemModifierOption } from "@/types/cart";

interface CartContextType {
    cartItems: CartItem[];
    cartId: string;
    handleCartUpdate: (item: CartItem) => Promise<void>;
    removeItemFromCart: (itemId: string) => Promise<void>;
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
    const userId = user?.id;
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string>(""); 
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);
    const [cartSuccess, setCartSuccess] = useState<string | null>(null);
    

    useEffect(() => {
        
        if(!user) {
            setCartId('');
            setCartItems([]);
        } else if(userId) {
            console.log('useEffect userId', userId);
            handleCartUpdate();
        }
    }, [userId, user]);

    useEffect(() => {
        const savedCartId = localStorage.getItem('cartId');
        const savedCartItems = localStorage.getItem('cartItems');
        
        if (savedCartItems) {
            setCartItems(JSON.parse(savedCartItems));
        }
        
        if (!savedCartId) {
            setCartId('');
        }
        fetchCart();
    }, [cartId]);

    const fetchCart = async () => {
        setIsCartLoading(true);
        setCartError(null);
        try {
            const response = await fetch(`/api/store/cart/${cartId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
           
            if (!response.ok) {
               throw new Error('Failed to fetch cart');
            }

            const cart = await response.json();
            setCartId(cart.id);
            setCartItems(cart.cart_items);
            localStorage.setItem('cartId', cart.id.substring(0, 8));
            localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to fetch cart');
        } finally {
            setIsCartLoading(false);
        }
    };

    const handleCartUpdate = async (item?: CartItem) => {
        console.log('handleCartUpdate', { userId, cartId, item });
        
        try {
            // Case 1: Guest adding item
            if (!userId && item) {
                if (!cartId || cartId === '') {
                    console.log('Guest user - create new cart');
                    await createNewCart(item);
                } else {
                    console.log('Guest user - update existing cart');
                    await updateExistingCart(item);
                }
            }
            // Case 2: User just signed in
            else if (userId) {
                // Check if user has an existing cart
                const response = await fetch('/api/store/cart/user', {
                    headers: {
                        'user-id': userId
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.status === 200) {
                    // User has existing cart - merge if anonymous cart exists
                    if (cartId) {
                        console.log('Merging anonymous cart with user cart');
                        const mergeResponse = await fetch(`/api/store/cart/merge/${cartId}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                customerId: userId
                            }),
                            credentials: 'include',
                        });
                        const mergeData = await mergeResponse.json();
                        if (mergeData.status === 200) {
                            setCartId(mergeData.cartId);
                            localStorage.setItem('cartId', mergeData.cartId.substring(0, 8));
                            await fetchCart();
                        }
                    } 
                    // No anonymous cart - update existing user cart
                    if(item) {
                        console.log('Update existing user cart');
                        await updateExistingCart(item);
                    }
                    console.log('Using existing user cart');
                    setCartId(data.cartId);
                    localStorage.setItem('cartId', data.cartId.substring(0, 8));
                    await fetchCart();
                } else if (cartId) {
                    // No existing user cart - associate anonymous cart
                    console.log('Associate anonymous cart with user');
                    const response = await fetch(`/api/store/cart/merge/${cartId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            customerId: userId
                        }),
                        credentials: 'include',
                    });
                    const data = await response.json();
                    if (data.status === 200) {
                        setCartId(data.cartId);
                        localStorage.setItem('cartId', data.cartId.substring(0, 8));
                        await fetchCart();
                    }
                } else if (item) {
                    // No carts at all - create new one
                    console.log('Create new cart for user');
                    await createNewCart(item);
                }
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const createNewCart = async (item: CartItem) => {
        try {
            const response = await fetch('/api/store/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: [item],
                    customerId: userId
                }),
                credentials: 'include',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create new cart');
            }
            const data = await response.json();
            console.log('createNewCart data', data);
            setCartSuccess(data.message);
            if(data.status === 200) {
                setCartId(data.cartId); 
                localStorage.setItem('cartId', data.cartId.substring(0, 8));
                await fetchCart();
            };
        }
        catch (error) {
            console.error('Error creating new cart:', error);
        }
    }

    const updateExistingCart = async (item: CartItem) => {
        try {
            const response = await fetch(`/api/store/cart/${cartId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: [item],
                    customerId: userId
                }),
                credentials: 'include',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update existing cart');
            }
            const data = await response.json();
            setCartSuccess(data.message);
            if(data.status === 200) {
                setCartId(data.cartId);
                localStorage.setItem('cartId', data.cartId.substring(0, 8));
                await fetchCart();
            };
        }
        catch (error) {
            console.error('Error updating existing cart:', error);
        }
    }

    const removeItemFromCart = async (itemId: string) => {
        console.log('removeItemFromCart', { cartId, itemId });
        const response = await fetch(`/api/store/cart/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId
            }),
            credentials: 'include',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove item from cart');
        }
        const data = await response.json();
        console.log(data);
        setCartSuccess(data.message);
        if(data.status === 200) {
            await fetchCart();
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartId,
            handleCartUpdate,
            removeItemFromCart,
            isCartLoading,
            cartError,
        }}>
            {children}
        </CartContext.Provider>
    );
};
