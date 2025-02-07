import { OrderItem, OrderItemModifier, OrderItemModifierOption } from "@/types/order"
import { Cart, CartItem, CartItemModifier, CartItemModifierOption } from "@/types/cart"

export const calculateItemTotal = (item: OrderItem) => {
    const modifierTotal: number | undefined = item?.modifiers?.reduce((total: number, modifier: OrderItemModifier) => {
        return total + modifier.options?.reduce((optTotal: number, opt: OrderItemModifierOption) => 
            optTotal + opt.price, 0
        );
    }, 0);
    return (item.price + (modifierTotal || 0)) * item.quantity;
};

export const calculateTotalPrice = (basePrice: CartItem['base_price'], quantity: CartItem['quantity'], modifiers: CartItemModifier[]) => {
    const modifierPrice = modifiers.reduce((total: number, modifier: CartItemModifier) => {
        return total + (modifier?.cart_item_modifier_options ?? []).reduce((optTotal: number, opt: CartItemModifierOption) => optTotal + (opt?.price ?? 0), 0);
    }, 0);
    
    return (basePrice + modifierPrice) * quantity;
};