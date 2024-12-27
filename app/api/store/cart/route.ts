import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server"; 


export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { customer_id, cart_items } = await request.json();
        
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
        
        if (cart_items[0].modifiers && cart_items[0].modifiers.length > 0) {
            const { data: cartItemModifiers, error: createCartItemModifiersError } = await supabase
                .from('cart_item_modifiers')
                .insert(
                    cart_items[0].modifiers.map((modifier: any) => ({
                        cart_items_id: cartItems?.[0].id,
                        modifier_id: modifier.id,
                    }))
                )
                .select();

            console.log('cartItemModifiers', cartItemModifiers, createCartItemModifiersError);
        }

        return NextResponse.json('test');
    } catch (error) {
        console.error('Error in cart items API:', error);
        return NextResponse.json(    
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }    
}

