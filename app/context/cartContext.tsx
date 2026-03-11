'use client'
import React, { createContext,  useContext, useEffect, useState } from "react";
import { CartItem, } from "@/types/cart";
import { useToast } from "./toastContext";

interface CartContextType {
    cartItems: CartItem[];
    handleCartUpdate: (item: CartItem) => Promise<void>;
    removeItemFromCart: (itemId: string) => Promise<void>;
    clearCart: () => void;
    isCartLoading: boolean;
    cartError: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    return useContext(CartContext);
};

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);
     
    useEffect(() => {
        const initializeCart = async () => {
            try {
                const savedCartItems = localStorage.getItem('cartItems');

                if(savedCartItems) {
                    try { 
                        const parsedItems = JSON.parse(savedCartItems);
                        setCartItems(parsedItems);
                    } catch (error) {
                        setCartError('Error parsing cart items');
                    }
                }

            } catch (error) {
                setCartError(error.message);
                console.log('Error initializing cart:', error)
            }
        };
        initializeCart();
    }, []);

    const clearCart = () => {
        localStorage.removeItem('cartId');
        localStorage.removeItem('cartItems');
        setCartItems([]);
    };

    useEffect(() => {
        try {
            if (cartItems.length > 0) {
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            } else {
                localStorage.removeItem('cartItems');
            }
        } catch (e) {
            console.error('Error syncing cart items to localStorage:', e);
        }
    }, [cartItems]);



    const handleCartUpdate = async (item?: CartItem) => {
        if(!item) return;
        try {

            const updatedItems = cartItems.map(cartItem => 
                cartItem.id === item.id ? item : cartItem
            )

            setCartItems(updatedItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

           
        } catch (error) {
            console.error('Error updating cart:', error);
            showToast('Failed to update cart', 'error');
        }
    };

    const removeItemFromCart = async (itemId: string) => {
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            handleCartUpdate,
            removeItemFromCart,
            clearCart,
            isCartLoading,
            cartError,
        }}>
            {children}
        </CartContext.Provider>
    );
};