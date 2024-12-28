export interface CartItem  {
    cart_id?: string;
    menu_item_id: number;
    menu_item_name: string;
    menu_item_image: string;
    base_price: number;
    special_instructions?: string;
    total_price: number;
    quantity: number;
    cart_item_modifiers?: CartItemModifier[];
};

export interface CartItemModifier  {
    id: number;
    cart_items_id?: number;
    modifier_id: number;
    modifier_name: string;
    cart_item_modifier_options?: CartItemModifierOption[];
};

export interface CartItemModifierOption {
    name: string;
    price: number;
};

export interface Cart {
    id: string;
    customer_id: string | null;
    completed_at: string | null;
    cart_items: CartItem[];
}
