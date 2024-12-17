'use client'
import React, { createContext, useContext, useState } from "react";

export interface CartItem  {
    id: string;
    cart_id: string;
    menu_item_id: number;
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

    const addItemToCart = (item: CartItem) => {
        setCartItems(prevItems => [...prevItems, item]);
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
        <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}