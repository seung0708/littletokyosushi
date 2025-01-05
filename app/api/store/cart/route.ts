import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server"; 

export async function POST(request: Request) {
    const supabase = createClient();
    const { customer_id, items } = await request.json();
    console.log('items', items);
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
                items.map((item: any) => ({
                    cart_id: cart.id,
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    base_price: item.base_price,
                    total_price: item.total_price,
                    special_instructions: item.special_instructions
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
        
        if (items[0].modifiers && items[0].modifiers.length > 0) {
            const { data: createItemModifiers, error: createCartItemModifiersError } = await supabase
                .from('cart_item_modifiers')
                .insert(
                    items[0].modifiers.map((modifier: any) => ({
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
            const {error: createCartItemModifierOptionsError} = await supabase
                .from('cart_item_modifier_options')
                .insert(
                    items[0].modifiers.flatMap((modifier: any, index: number) => 
                        modifier.modifier_options.map((option: any) => ({
                            cart_item_modifiers_id: createItemModifiers?.[index]?.id, 
                            modifier_option_id: option.modifier_option_id,
                            modifier_option_price: option.price,
                            modifier_id: modifier.id,
                        }))
                    )
                )
            if (createCartItemModifierOptionsError) {
                console.error('Error creating cart item modifier options:', createCartItemModifierOptionsError);
                return NextResponse.json(
                    { error: 'Failed to create cart item modifier options' },
                    { status: 500 }
                );
            }

        }

        return NextResponse.json(
            { message: 'Cart created successfully', cartId: cart.id, cartItems , status: 200 }
        );


    } catch (error) {
        console.error('Error in cart items API:', error);
        return NextResponse.json(    
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }    
}

// export const DELETE = async (request: Request) => {
//     const supabase = createClient();
//     const { cartId } = await request.json();
//     if(!cartId) return;
//     try {
//         const { error } = await supabase.from('carts').delete().eq('id', cartId);
//         if (error) {
//             console.error('Error deleting cart:', error);
//             return NextResponse.json(
//                 { error: 'Error deleting cart' },
//                 { status: 500 }
//             );
//         }
//         return NextResponse.json({ message: 'Cart deleted successfully' }, { status: 200 });
//     } catch (error) {
//         console.error('Error deleting cart:', error);
//         return NextResponse.json(
//             { error: 'Error deleting cart' },
//             { status: 500 }
//         );
//     }
// }