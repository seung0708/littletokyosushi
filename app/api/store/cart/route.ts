import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server"; 


export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { customer_id, cart_items } = await request.json();
        console.log('body',customer_id, cart_items);
        const { data: cart, error: createCartError } = await supabase
            .from('carts')
            .insert({
                customer_id: customer_id || null
            })
            .select()

        if (createCartError) {
            console.error('Error creating cart:', createCartError);
            return NextResponse.json(
                { error: 'Failed to create cart' },
                { status: 500 }
            );
        }

        const {data: cartItems, error: insertCartItemsError } = await supabase
            .from('cart_items')
            .insert(
                cart_items.map(item => ({
                    cart_id: cart?.[0]?.id,
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    base_price: item.base_price,
                    total_price: item.total_price

                }))
            )
            .select()
        
        if (insertCartItemsError) {
            console.error('Error inserting cart items:', insertCartItemsError);
            return NextResponse.json(
                { error: 'Failed to insert cart items' },
                { status: 500 }
            );
        }

        if(cart_items.modifiers) {
            const {error: insertCartModifiersError } = await supabase
            .from('cart_item_modifiers')
            .insert(
                cart_items.modifiers.map(modifier => ({ 
                    cart_item_id: modifier.cart_item_id,
                    modifier_id: modifier.modifier_id
                }))
            )

            if (insertCartModifiersError) {
                console.error('Error inserting cart modifiers:', insertCartModifiersError);
                return NextResponse.json(
                    { error: 'Failed to insert cart modifiers' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            cart_id: cart?.[0]?.id,
            cart_items: cartItems,
        });
    } catch (error) {
        console.error('Error in cart items API:', error);
        return NextResponse.json(    
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }    
}

