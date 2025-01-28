import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server"; 
import { APIError } from "@/lib/utils/api-error";

export async function POST(request: Request) {
    const supabase = await createClient();
    
    try {
        const { customer_id, items } = await request.json();
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new APIError('Invalid cart items', 400);
        }

        // Validate items structure
        for (const item of items) {
            if (!item.menu_item_id || !item.quantity || !item.base_price) {
                throw new APIError('Invalid item structure', 400);
            }
            if (item.quantity <= 0) {
                throw new APIError('Item quantity must be greater than 0', 400);
            }
        }
    
        const { data: cart, error: createCartError } = await supabase
            .from('carts')
            .insert({
                customer_id: customer_id || null
            })
            .select()
            .single();
        
        if (createCartError) {
            console.error('Error creating cart:', createCartError);
            throw new APIError('Failed to create cart', 500);
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
            // Cleanup the cart if items creation fails
            await supabase.from('carts').delete().eq('id', cart.id);
            console.error('Error creating cart items:', createCartItemsError);
            throw new APIError('Failed to create cart items', 500);
        }
        
        if (items[0].modifiers && items[0].modifiers.length > 0) {
            const { error: createCartItemModifiersError } = await supabase
                .from('cart_item_modifiers')
                .insert(
                    items[0].modifiers.map((modifier: any) => ({
                        cart_item_id: cartItems[0].id,
                        modifier_id: modifier.id,
                        quantity: modifier.quantity,
                        price: modifier.price
                    }))
                );

            if (createCartItemModifiersError) {
                // Cleanup if modifier creation fails
                await supabase.from('cart_items').delete().eq('cart_id', cart.id);
                await supabase.from('carts').delete().eq('id', cart.id);
                console.error('Error creating cart item modifiers:', createCartItemModifiersError);
                throw new APIError('Failed to add modifiers to cart items', 500);
            }
        }

        return NextResponse.json({
            message: 'Cart created successfully',
            cart,
            cartItems
        });

    } catch (error) {
        console.error('Cart creation error:', error);
        
        if (error instanceof APIError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
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