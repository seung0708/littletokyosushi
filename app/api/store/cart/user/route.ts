import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const supabase = createClient();
    const userId = request.headers.get('user-id');
    console.log('GET /api/store/cart/user -userId', userId);
    try {
        // Get the user's cart ID
        const { data: userCart, error: cartError } = await supabase
            .from('carts')
            .select(`id, customer_id, completed_at, 
                cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls), 
                cart_item_modifiers(id, modifiers(id, name), 
                    cart_item_modifier_options(id, modifier_id, modifier_options(id, name, price))))`)
            .eq('customer_id', request.headers.get('user-id'))
            .single();

        if (cartError && cartError.code !== 'PGRST116') {
            console.error('Error fetching user cart:', cartError);
            return NextResponse.json(
                { error: 'Failed to fetch user cart' },
                { status: 500 }
            );
        }

        if (!userCart) {
            return NextResponse.json({ cart: null });
        }

        return NextResponse.json({ message: 'User cart fetched successfully', status: 200, cartId: userCart.id});
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
