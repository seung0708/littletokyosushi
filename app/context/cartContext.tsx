'use client'
import React, { createContext,  useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { CartItem, } from "@/types/cart";
import { useToast } from "./toastContext";
import { retryWithBackoff } from "@/lib/utils/api-retry";

interface CartContextType {
    cartItems: CartItem[];
    cartId: string;
    handleCartUpdate: (item: CartItem) => Promise<void>;
    removeItemFromCart: (itemId: string) => Promise<void>;
    updateCartCustomerId: (customerId: string) => Promise<void>;
    clearCart: () => void;
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
    const { showToast } = useToast();
    const { user } = useAuth();
    const userId = user?.id;
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string>(""); 
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);
    
    useEffect(() => {
        const savedCartId = localStorage.getItem('cartId');
        if (savedCartId && userId) {
            updateCartCustomerId(userId);
        } else if (savedCartId) {
            setCartId(savedCartId);
            fetchCart();
        }
        const savedCartItems = localStorage.getItem('cartItems');
        if (savedCartItems) {
            setCartItems(JSON.parse(savedCartItems));  
        } else {
            setCartItems([]);  
        }
    }, [cartId,userId]);

    const clearCart = () => {
        localStorage.removeItem('cartId');
        localStorage.removeItem('cartItems');
        setCartItems([]);
        setCartId('');
    };

    const fetchCart = async () => {
        
        if (!cartId) return;
        setIsCartLoading(true);
        setCartError(null);
        try {
            const response = await retryWithBackoff(async () => 
                await fetch(`/api/store/cart/${cartId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                credentials: 'include',
                })
            );
           
            if (response.status === 404) {
                // Cart not found in database, clear local storage
                console.log('Cart not found in database, clearing local storage');
                localStorage.removeItem('cartId');
                localStorage.removeItem('cartItems');
                setCartId('');
                setCartItems([]);
                return;
            }

            if (!response.ok) {
               const errorData = await response.json();
               console.error('Cart fetch failed:', errorData);
               throw new Error(errorData.error || 'Failed to fetch cart');
            }

            const data = await response.json();
            console.log(data);
            setCartId(data.id);
            setCartItems(data.cart_items);
            localStorage.setItem('cartId', data.id);
            localStorage.setItem('cartItems', JSON.stringify(data.cart_items));
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to fetch cart');
        } finally {
            setIsCartLoading(false);
        }
    };

    const updateCartCustomerId = async (customerId: string) => {
        if (!cartId) return;
        
        const response = await retryWithBackoff(async () => 
            await fetch(`/api/store/cart/merge/${cartId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId
                }),
                credentials: 'include',
            })
        );

        const data = await response.json();
        if (data.status === 200) {
            setCartId(data.cartId);
            localStorage.setItem('cartId', data.cartId);
            await fetchCart();
        }
    };

    const handleCartUpdate = async (item?: CartItem) => {
        if(!item) return;
        try {

            const updatedItems = cartItems.map(cartItem => 
                cartItem.id === item.id ? item : cartItem
            )

            setCartItems(updatedItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

            // Case 1: Guest adding item
            if (!userId && item) {
                if (!cartId || cartId === '') {
                    await createNewCart(item);
                } else {
                    await updateExistingCart(item);
                }
            }
            // Case 2: User just signed in
            else if (userId && user) {
                // Check if user has an existing cart
                const response = await retryWithBackoff(async () => 
                    await fetch('/api/store/cart/user', {
                        headers: {
                            'user-id': userId
                        },
                        credentials: 'include'
                    })
                );

                const data = await response.json();
        
                if (data.status === 200) {
                    // User has existing cart - merge if anonymous cart exists
                    if (cartId) {
                        
                        const mergeResponse = await retryWithBackoff(async () => 
                            await fetch(`/api/store/cart/merge/${cartId}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    customerId: userId
                                }),
                                credentials: 'include',
                            })
                        );

                        const mergeData = await mergeResponse.json();
                        if (mergeData.status === 200) {
                            setCartId(mergeData.cartId);
                            localStorage.setItem('cartId', mergeData.cartId);
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
                    localStorage.setItem('cartId', data.cartId);
                    await fetchCart();
                } else if (cartId) {
                                        
                    const response = await retryWithBackoff(async () => 
                        await fetch(`/api/store/cart/merge/${cartId}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                customerId: userId
                            }),
                            credentials: 'include',
                        })
                    );
                    const data = await response.json();
                    if (data.status === 200) {
                        setCartId(data.cartId);
                        localStorage.setItem('cartId', data.cartId);
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
            showToast('Failed to update cart', 'error');
        }
    };

    const createNewCart = async (item: CartItem) => {
        try {
            const response = await retryWithBackoff(async () => 
                await fetch('/api/store/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: [item],
                        customerId: userId
                    }),
                    credentials: 'include',
                })
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create new cart');
            }
            const data = await response.json();
            
            if(data.status === 200) {
                // Update cart ID
                setCartId(data.cartId); 
                localStorage.setItem('cartId', data.cartId);
                
                // Then fetch full cart data
                await fetchCart();
            };
        }
        catch (error) {
            console.error('Error creating new cart:', error);
        }
    }

    const updateExistingCart = async (item: CartItem) => {
        try {
            const response = await retryWithBackoff(async () => 
                await fetch(`/api/store/cart/${cartId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cartItems: [item],
                        customerId: userId
                    }),
                    credentials: 'include',
                })
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update existing cart');
            }
            const data = await response.json();
            
            if(data.status === 200) {
                // Update cart ID
                setCartId(data.cartId);
                localStorage.setItem('cartId', data.cartId);
                            
                // Then fetch full cart data
                await fetchCart();
            };
        }
        catch (error) {
            console.error('Error updating existing cart:', error);
        }
    }

    const removeItemFromCart = async (itemId: string) => {
        const response = await retryWithBackoff(async () => 
            await fetch(`/api/store/cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId
                }),
            credentials: 'include',
            })
        );
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove item from cart');
        }
        const data = await response.json();
        console.log(data);
        
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
            updateCartCustomerId,
            clearCart,
            isCartLoading,
            cartError,
        }}>
            {children}
        </CartContext.Provider>
    );
};