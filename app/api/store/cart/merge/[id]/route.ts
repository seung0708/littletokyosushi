import {createClient} from "@/lib/supabase/server";
import {cookies} from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    let fullCartId = cookies().get('fullCartId')?.value;

    const supabase = await createClient(); 
    const { customerId } = await request.json();

    const { data: existingCart, error: existingCartError } = await supabase
        .from('carts')
        .select('*')
        .eq('customer_id', customerId)
        .single();
    
    if (existingCartError) {
        console.error('Error fetching existing cart:', existingCartError);
        return NextResponse.json(
            { error: 'Failed to fetch existing cart' },
            { status: 500 }
        );
    }
    
    const { data: dbCart, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('id', fullCartId)
        .single();
    
        console.log('dbCart:', dbCart);

    if (cartError) {
        console.error('Error fetching cart items:', cartError);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }

    console.log('existingCart:', existingCart);
    console.log('dbCart:', dbCart);

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
        
        const response = await fetch(`/api/store/cart/${fullCartId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete cart');
        }

        cookies().set('fullCartId', existingCart.id);


    }

    if (!dbCart) {
        return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    } else {
        const {error: updateCartError } = await supabase
            .from('carts')
            .update({ customer_id: customerId })
            .eq('id', fullCartId)

        if (updateCartError) {
            console.error('Error updating cart:', updateCartError);
            return NextResponse.json(
                { error: 'Failed to update cart' },
                { status: 500 }
            );
        }
    }



    return NextResponse.json({
        cart: existingCart, 
        message: 'Cart merged successfully',
        status: 200
    });
}