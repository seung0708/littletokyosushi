import { MenuItem, Modifier, ModifierOption } from "./item";

export interface Cart {
    id: string;
    customer_id: string | null;
    created_at?: string;
    updated_at?: string;
    cart_items: CartItem[];
}

export interface CartItem  {
    id?: string;
    cart_id?: string;
    menu_items?: MenuItem | null;
    quantity: number;
    base_price: number;
    total_price: number;
    special_instructions?: string;
    created_at?: string;
    updated_at?: string;
    cart_item_modifiers?: CartItemModifier[] | null;
};

export interface CartItemModifier  {
    id?: string;
    cart_items_id?: string;
    modifiers?: Modifier | null;
    created_at?: string;
    cart_item_modifier_options?: CartItemModifierOption[] | null;
};

export interface CartItemModifierOption {
    id?: string;
    cart_item_modifier_id?: string;
    modifier_id: number;
    modifier_option_id: number;
    modifier_options?: ModifierOption;
};
