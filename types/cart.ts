import { MenuItem, Modifier, ModifierOption } from "./item";

export interface Cart {
    id: string;
    customer_id: string | null;
    created_at: string;
    updated_at: string;
    cart_items: CartItem[];
}

export interface CartItem  {
    id?: string;
    cart_id: string;
    menu_item: MenuItem;
    quantity: number;
    base_price: number;
    total_price: number;
    special_instructions?: string;
    created_at: string;
    updated_at: string;
    cart_item_modifiers?: CartItemModifier[];
};

export interface CartItemModifier  {
    id: string;
    cart_items_id?: string;
    modifier: Modifier;
    created_at: string;
    cart_item_modifier_options?: CartItemModifierOption[];
};

export interface CartItemModifierOption {
    id: string;
    cart_item_modifiers_id?: string;
    modifier_id: number;
    modifier_options: ModifierOption[];
    name: string;
    price: number;
};

