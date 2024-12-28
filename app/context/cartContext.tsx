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
    cartId: string;
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
    const [cartId, setCartId] = useState<string>("");
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);

    useEffect(() => {   
        // First load stored data
        const storedCartId = localStorage.getItem('cartId');
        const storedCartItems = localStorage.getItem('cartItems');
        
        // Update states if data exists
        if (storedCartItems && storedCartItems !== 'undefined' && storedCartItems !== 'null') {
            setCartItems(JSON.parse(storedCartItems));
        }
        
        if (storedCartId) {
            setCartId(storedCartId);
            if (!storedCartItems || storedCartItems === 'undefined' || storedCartItems === 'null') {
                fetchCart();
            }
        }
    }, []);

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
                console.log(data);
                setCartItems(data.cart_items || []);
                localStorage.setItem('cartItems', JSON.stringify(data.cart_items));
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartError(error instanceof Error ? error.message : 'Failed to fetch cart');
        } finally {
            setIsCartLoading(false);
        }
    };


    const addItemToCart = async (item: CartItem) => {
        try {
            setIsCartLoading(true);
            setCartError(null);
            if(!customerId) {
                console.log('Entering !customerId block');
                console.log('!cartId evaluation:', !cartId); 
                if(!cartId || cartId === '') {
                    console.log('Entering !cartId block - should create new cart');
                    const response = await fetch('/api/store/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            cart_items: [item],
                            customer_id: customerId,
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json();
                    setCartId(data.id);
                    localStorage.setItem('cartId', data.id);
                    setCartItems(data.cart_items || []);
                    localStorage.setItem('cartItems', JSON.stringify(data.cart_items));
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
                    console.log(data);
                    setCartItems(prevItems => {
                        const updatedItems = [...prevItems, data];
                        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                        return updatedItems;
                    });
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
                            cart_items: [...cartItems, item], 
                            customer_id: customerId
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json();
                    setCartId(data.id);
                    localStorage.setItem('cartId', data.id);
                    setCartItems(data.cart_items || []);
                    localStorage.setItem('cartItems', JSON.stringify(data.cart_items));
                } else {
                    const response = await fetch(`/api/store/cart/${cartId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify({
                            cart_items: [...cartItems, item],
                            customer_id: customerId
                        }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }
                    const data = await response.json();
                    console.log(data);
                    setCartItems(prevItems => {
                        const updatedItems = [...prevItems, data];
                        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                        return updatedItems;
                    });
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
