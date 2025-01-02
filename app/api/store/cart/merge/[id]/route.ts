import {createClient} from "@/lib/supabase/server";
import {cookies} from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    const fullCartId = cookies().get('fullCartId')?.value;

    const supabase = await createClient(); 
    const { customerId } = await request.json();
    
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

    if (!dbCart) {
        return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const {data: updatedCart, error: updateCartError } = await supabase
        .from('carts')
        .update({ customer_id: customerId })
        .eq('id', fullCartId)
        .single();

    if (updateCartError) {
        console.error('Error updating cart:', updateCartError);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }

    console.log('updatedCart:', updatedCart);

    return NextResponse.json({ message: 'Cart merged successfully' });
}