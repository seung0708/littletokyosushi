'use client'
import React, { createContext,  useContext, useEffect, useState } from "react";
import { CartItem, } from "@/types/cart";
import { useToast } from "./toastContext";

interface CartContextType {
    cartItems: CartItem[];
    handleCartUpdate: (item: CartItem) => void;
    removeItemFromCart: (itemId: string) => void;
    clearCart: () => void;
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
     
    useEffect(() => {
        initializeCart();
    }, []);

    const initializeCart = () => {
            try {
                const savedCartItems = localStorage.getItem('cartItems');

                if(savedCartItems) {
                    try { 
                        const parsedItems = JSON.parse(savedCartItems);
                        setCartItems(parsedItems);
                    } catch (error) {
                        console.error(`Error parsing cart items: ${error}`);
                    }
                }

            } catch (error) {
                console.log(`Error initializing cart: ${error}`)
            }
        };

    const clearCart = () => {
        localStorage.removeItem('cartItems');
        setCartItems([]);
    };


    const handleCartUpdate = (item?: CartItem) => {
        if(!item) return;
        try {

            const itemIsInCart = cartItems.findIndex(cartItem => item.id === cartItem.id)

            if (itemIsInCart !== -1) {
                const updatedItems = cartItems.map(cartItem => 
                    cartItem.id === item.id 
                    ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
                )

                setCartItems(updatedItems);
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));    
            } else {
                const updatedItems = [...cartItems, item];
                setCartItems(updatedItems);
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            }
            showToast('Item added to cart', 'success')

        } catch (error) {
            console.error('Error updating cart:', error);
            showToast('Failed to update cart', 'error');
        }
    };

    const removeItemFromCart = (itemId: string) => {
        if (!itemId) return;
        try {
            const updatedCart = cartItems.filter(cartItem => cartItem.id !== itemId)

            setCartItems(updatedCart);
            localStorage.setItem('cartItems', JSON.stringify(updatedCart));

        } catch (error) {
            console.error(`Error removing item from cart, ${error}`)
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            handleCartUpdate,
            removeItemFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};