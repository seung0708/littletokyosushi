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
        fetchCart();
        const currentCartItems = cartItems;
        const storedCartItems = JSON.parse(localStorage.getItem('partialCartId') || '[]');
        if (currentCartItems !== storedCartItems) {
            localStorage.setItem('cartItems', JSON.stringify(currentCartItems));
        }
        if(userId) {
            handleCartMerge();
        }
        
    }, [userId]);

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
               localStorage.removeItem('cartId');
               localStorage.removeItem('cartItems');
               throw new Error('Failed to fetch cart');
            }

            const cart = await response.json();
            setCartItems(cart.cart_items);
            setCartId(cart.id);
            localStorage.setItem('partialCartId', cart.id.substring(0, 8));
            localStorage.setItem('cartItems', JSON.stringify(cart.cart_items));
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to fetch cart');
        } finally {
            setIsCartLoading(false);
        }
    };

    const handleCartMerge = async () => {
        const response = await fetch(`/api/store/cart/merge/${cartId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: user?.id
            }),
            credentials: 'include',
        });
        const data = await response.json();
        if (data.cart.id.substring(0, 8) !== cartId) {
            setCartId(data.cart.id);
            localStorage.setItem('cartId', data.cart.id.substring(0, 8));
            localStorage.setItem('partialCartId', data.cart.id.substring(0, 8));
            localStorage.setItem('cartItems', JSON.stringify(data.cart.cart_items));
        }
        console.log('handleCartMerge data', data);
    }

    const handleCartUpdate = async (item: CartItem) => {
        console.log('handleCartUpdate item', item);
        try {
          if (!userId) {
            if (!cartId || cartId === '') {
              await createNewCart(item); 
            } else {
              await updateExistingCart(item);
            }
          } else {
            if (!cartId || cartId === '') {
              await createNewCart(item);  
            } else {
              await updateExistingCart(item);
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
            setCartSuccess(data.message);
            if(data.status === 200) {
                const displayId = data.cartId.substring(0, 8);
                fetchCart();
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
                fetchCart();
            };
        }
        catch (error) {
            console.error('Error updating existing cart:', error);
        }
    }

    const removeItemFromCart = async (itemId: string) => {
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
            fetchCart();
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
