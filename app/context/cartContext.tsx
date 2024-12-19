'use client'
import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem  {
    id: string;
    cart_id: string;
    menu_item_id: number
    quantity: number;
    base_price: number;
    total_price: number;
    modifiers: CartItemModifier[];
};

export interface CartItemModifier  {
    id: string;
    cart_item_id: string;
    options: CartItemModifierOption[];
};

export interface CartItemModifierOption {
    id: string;
    name: string;
    price: number;
};

interface CartContextType {
    cartItems: CartItem[];
    cartId: string | null;
    addItemToCart: (item: CartItem) => void;
    removeItemFromCart: (id: string) => void;
    updateItemQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string | null>(null);

    useEffect(() => {
        // Try to get existing cart ID from localStorage
        const storedCartId = localStorage.getItem('cartId');
        if (storedCartId) {
            setCartId(storedCartId);
        }

        const fetchCart = async () => {
            try {
                if (!storedCartId) {
                    // Create new cart if none exists
                    const response = await fetch('/api/store/cart', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    localStorage.setItem('cartId', data.id);
                    setCartId(data.id);
                } else {
                    // Fetch existing cart items
                    const response = await fetch(`/api/store/cart/${storedCartId}`);
                    const data = await response.json();
                    setCartItems(data);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, []);

    const addItemToCart = async (item: CartItem) => {
        try {
            const response = await fetch(`/api/main/cart/${cartId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
            const newItem = await response.json();
            setCartItems([...cartItems, newItem]);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const removeItemFromCart = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateItemQuantity = (id: string, quantity: number) => {
        setCartItems(prevItems => prevItems.map(item => item.id === id ? { ...item, quantity: quantity } : item));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, cartId, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}