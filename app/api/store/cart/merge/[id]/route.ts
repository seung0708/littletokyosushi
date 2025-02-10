import {createClient} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient(); 
    const { customerId } = await request.json();
    console.log('Merging carts:', { id, customerId });
    // Get the current cart
    const { data: currentCart, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('id', id)
        .single();
    console.log('Current cart:', currentCart);
    if (cartError) {
        console.error('Error fetching cart:', cartError);
        return NextResponse.json(
            { error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
    
    // Check if customer has any existing cart
    const { data: existingCart, error: existingCartError } = await supabase
        .from('carts')
        .select('*')
        .eq('customer_id', customerId)
        .single();

    console.log('Existing cart:', existingCart);
    if (existingCartError && existingCartError.code !== 'PGRST116') {
        console.error('Error fetching cart:', existingCartError);
        return NextResponse.json(
            { error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }

    // Case 1: Customer has no existing cart - just update the current cart
    if (!existingCart) {
        const { data: updatedCart, error: updateError } = await supabase
            .from('carts')
            .update({ customer_id: customerId })
            .eq('id', id)
            .select();
        
        console.log('Updated cart:', updatedCart);

        if (!updatedCart || updatedCart.length === 0) {
            console.error('No cart was updated');
            return NextResponse.json(
                { error: 'Failed to update cart' },
                { status: 500 }
            );
        }

        if (updateError) {
            console.error('Error updating cart:', updateError);
            return NextResponse.json(
                { error: 'Failed to update cart' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            status: 200,
            cartId: updatedCart[0].id
        });
    }

    // Case 2: Customer has an existing cart - merge items and delete current cart
    const { data: cartItems, error: cartItemsError } = await supabase
        .from('cart_items')
        .select(`
            *,
            cart_item_modifiers (
                *,
                cart_item_modifier_options (*)
            )
        `)
        .eq('cart_id', currentCart.id);

    if (cartItemsError) {
        console.error('Error fetching cart items:', cartItemsError);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }

    // Move items to existing cart
    if (cartItems && cartItems.length > 0) {
        const { error: updateItemsError } = await supabase
            .from('cart_items')
            .update({ cart_id: existingCart.id })
            .eq('cart_id', currentCart.id);

        if (updateItemsError) {
            console.error('Error moving cart items:', updateItemsError);
            return NextResponse.json(
                { error: 'Failed to move cart items' },
                { status: 500 }
            );
        }

        // Delete the old cart
        const { error: deleteError } = await supabase
            .from('carts')
            .delete()
            .eq('id', currentCart.id);

        if (deleteError) {
            console.error('Error deleting old cart:', deleteError);
            // Don't return error since items were moved successfully
        }
    }

    return NextResponse.json({
        status: 200,
        cartId: existingCart.id
    });
}