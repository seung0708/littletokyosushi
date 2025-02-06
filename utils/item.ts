import { OrderItem, OrderItemModifier, OrderItemModifierOption } from "@/types/order"

export const calculateItemTotal = (item: OrderItem) => {
    const modifierTotal: number | undefined = item?.modifiers?.reduce((total: number, modifier: OrderItemModifier) => {
        return total + modifier.options?.reduce((optTotal: number, opt: OrderItemModifierOption) => 
            optTotal + opt.price, 0
        );
    }, 0);
    return (item.price + (modifierTotal || 0)) * item.quantity;
};