import {createClient} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient(); 
    const { customerId } = await request.json();

    const { data: existingCart, error: existingCartError } = await supabase
        .from('carts')
        .select('*')
        .eq('customer_id', customerId)
        .single();
    
    console.log('existingCart:', existingCart, 'existingCartError:', existingCartError);
   
    const { data: dbCart, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('id', params.id)
        .single();
    
    if (cartError) {
        console.error('Error fetching cart items:', cartError);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }

    // If user has an existing cart, merge the carts
    if (existingCart && !dbCart.customer_id) {
        console.log('merging cart');
        
        const { error: updateCartItemsError } = await supabase
            .from('cart_items')
            .update(
                dbCart?.cart_items.map((item: any) => ({
                    cart_id: existingCart.id
                }))
            )
            .eq('cart_id', dbCart.id);

        if (updateCartItemsError) {
            console.error('Error updating cart items:', updateCartItemsError);
            return NextResponse.json(
                { error: 'Failed to update cart items' },
                { status: 500 }
            );
        }     
        
        // Delete the anonymous cart after merging
        const response = await fetch(`/api/store/cart/${params.id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete cart');
        }

        // Fetch the updated cart with all its items
        const { data: updatedCart, error: fetchError } = await supabase
            .from('carts')
            .select(`id, customer_id, completed_at, 
                cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls))`)
            .eq('id', existingCart.id)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: 'Failed to fetch updated cart' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Cart merged successfully',
            status: 200,
            cartId: updatedCart.id
        });
    }
    
    // If no existing cart or PGRST116 error (no rows), update the anonymous cart
    if (!existingCart || (existingCartError && existingCartError.code === 'PGRST116')) {
        const {error: updateCartError } = await supabase
            .from('carts')
            .update({ customer_id: customerId })
            .eq('id', params.id);

        if (updateCartError) {
            console.error('Error updating cart:', updateCartError);
            return NextResponse.json(
                { error: 'Failed to update cart' },
                { status: 500 }
            );
        }

        // Fetch the updated cart
        const { data: updatedCart, error: fetchError } = await supabase
            .from('carts')
            .select(`id, customer_id, completed_at, 
                cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls))`)
            .eq('id', params.id)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: 'Failed to fetch updated cart' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Cart updated successfully',
            status: 200,
            cartId: updatedCart.id
        });
    }

    return NextResponse.json({ error: 'Invalid cart state' }, { status: 400 });
}