import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const supabase = await createClient();
    const userId = request.headers.get('user-id');
    console.log('Received request for user cart:', userId);
    try {
        // Get the user's cart ID
        console.log('Fetching cart for user:', userId);
        const { data: userCart, error: cartError } = await supabase
            .from('carts')
            .select(`id, customer_id, 
                cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls), 
                cart_item_modifiers(id, modifiers(id, name), 
                    cart_item_modifier_options(id, modifier_id, modifier_options(id, name, price))))`)
            .eq('customer_id', userId)
            .single();

        console.log('Supabase query result:', { userCart, cartError });
        console.log('Query result:', { userCart, cartError });

        if (cartError && cartError.code !== 'PGRST116') {
            console.error('Error fetching user cart:', cartError);
            return NextResponse.json(
                { error: 'Failed to fetch user cart' },
                { status: 500 }
            );
        }

        if (!userCart) {
            return NextResponse.json({ cart: null, status: 404 });
        }

        return NextResponse.json({ 
            status: 200,
            cartId: userCart.id,
            cart: userCart
        });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
