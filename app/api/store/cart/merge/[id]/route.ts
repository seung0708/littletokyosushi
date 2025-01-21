import {createClient} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient(); 
    const { customerId } = await request.json();
    
    // Get the current cart
    const { data: currentCart, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('id', params.id)
        .single();
    
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

    console.log('Cart state:', {
        currentCartId: currentCart.id,
        currentCartCustomerId: currentCart.customer_id,
        existingCart: existingCart ? existingCart.id : null,
        newCustomerId: customerId
    });

    // Case 1: Customer has no existing cart - just update the current cart
    if (!existingCart || existingCartError?.code === 'PGRST116') {
        const { data: updatedCart, error: updateError } = await supabase
            .from('carts')
            .update({ customer_id: customerId })
            .eq('id', params.id)
            .select();

            if (!updatedCart || updatedCart.length === 0) {
                console.error('No cart was updated');
                return NextResponse.json(
                    { error: 'Failed to update cart' },
                    { status: 500 }
                );
            }
            
            return NextResponse.json({
                message: 'Cart updated successfully',
                status: 200,
                cartId: updatedCart[0].id
            });

        if (updateError) {
            console.error('Error updating cart:', updateError);
            return NextResponse.json(
                { error: 'Failed to update cart' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Cart updated successfully',
            status: 200,
            cartId: updatedCart[0].id
        });
    }

    // Case 2: Customer has an existing cart - merge items and delete current cart
    const { data: cartItems, error: cartItemsError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', currentCart.id);

    if (cartItemsError) {
        console.error('Error fetching cart items:', cartItemsError);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }

    // Move items to existing cart
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

    // Delete the current cart
    await supabase
        .from('carts')
        .delete()
        .eq('id', currentCart.id);

    return NextResponse.json({
        message: 'Cart merged successfully',
        status: 200,
        cartId: existingCart.id
    });
}