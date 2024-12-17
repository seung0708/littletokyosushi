import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const POST = async (req: Request) => {
    const supabase = await createClient();
    try {
        const { guestCartId, userId } = await req.json();

        // First, check if user already has an active cart
        const { data: existingCart, error: existingCartError } = await supabase
            .from('carts')
            .select('id')
            .eq('customer_id', userId)
            .is('completed_at', null)
            .single();

        if (existingCartError && existingCartError.code !== 'PGRST116') {
            throw existingCartError;
        }

        if (existingCart) {
            // Merge items from guest cart to existing cart
            const { data: guestItems } = await supabase
                .from('cart_items')
                .select('*')
                .eq('cart_id', guestCartId);

            if (guestItems && guestItems.length > 0) {
                const mergedItems = guestItems.map(item => ({
                    ...item,
                    cart_id: existingCart.id,
                    id: undefined // Let DB generate new ID
                }));

                const { error: mergeError } = await supabase
                    .from('cart_items')
                    .insert(mergedItems);

                if (mergeError) throw mergeError;
            }

            // Delete guest cart
            const { error: deleteError } = await supabase
                .from('carts')
                .delete()
                .eq('id', guestCartId);

            if (deleteError) throw deleteError;

            return NextResponse.json({ cartId: existingCart.id });
        } else {
            // Update guest cart with user ID
            const { error: updateError } = await supabase
                .from('carts')
                .update({ customer_id: userId })
                .eq('id', guestCartId);

            if (updateError) throw updateError;

            return NextResponse.json({ cartId: guestCartId });
        }
    } catch (error) {
        console.error('Error merging cart:', error);
        return NextResponse.json(
            { error: 'Failed to merge cart' },
            { status: 500 }
        );
    }
}
