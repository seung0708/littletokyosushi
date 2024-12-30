import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server"; 
import { Cart} from "@/types/cart";

export async function POST(request: Request) {
    const supabase = createClient();
    const { customer_id, cart_items } = await request.json();
    try {
        const { data: cart, error: createCartError } = await supabase
            .from('carts')
            .insert({
                customer_id: customer_id || null
            })
            .select()
            .single();

        if (createCartError) {
            console.error('Error creating cart:', createCartError);
            return NextResponse.json(
                { error: 'Failed to create cart' },
                { status: 500 }
            );
        }

        const { data: cartItems, error: createCartItemsError } = await supabase
            .from('cart_items')
            .insert(
                cart_items.map((item: any) => ({
                    cart_id: cart.id,
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    base_price: item.base_price,
                    total_price: item.total_price
                }))
            )
            .select();

        if (createCartItemsError) {
            console.error('Error creating cart items:', createCartItemsError);
            return NextResponse.json(
                { error: 'Failed to create cart items' },
                { status: 500 }
            );
        }
        
        if (cart_items[0].cart_item_modifiers && cart_items[0].cart_item_modifiers.length > 0) {
            const { data: createItemModifiers, error: createCartItemModifiersError } = await supabase
                .from('cart_item_modifiers')
                .insert(
                    cart_items[0].cart_item_modifiers.map((modifier: any) => ({
                        cart_items_id: cartItems?.[0].id,
                        modifier_id: modifier.id,
                    }))
                ).select();

            if (createCartItemModifiersError) {
                console.error('Error creating cart item modifiers:', createCartItemModifiersError);
                return NextResponse.json(
                    { error: 'Failed to create cart item modifiers' },
                    { status: 500 }
                );
            }
            const {data: createItemModifierOptions, error: createCartItemModifierOptionsError} = await supabase
                .from('cart_item_modifier_options')
                .insert(
                    cart_items[0].cart_item_modifiers.flatMap((modifier: any, index: number) => 
                        modifier.modifier_options.map((option: any) => ({
                            cart_item_modifiers_id: createItemModifiers?.[index]?.id,  // Use the first modifier ID (or adjust as needed)
                            modifier_option_id: option.modifier_option_id,
                            modifier_option_price: option.price,
                            modifier_id: modifier.id,
                        }))
                    )
                )
                .select();

            if (createCartItemModifierOptionsError) {
                console.error('Error creating cart item modifier options:', createCartItemModifierOptionsError);
                return NextResponse.json(
                    { error: 'Failed to create cart item modifier options' },
                    { status: 500 }
                );
            }

        }

        return NextResponse.json(
            { cartId: cart.id },
            { status: 200 });
    } catch (error) {
        console.error('Error in cart items API:', error);
        return NextResponse.json(    
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }    
}

