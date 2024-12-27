import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';


export async function GET(request: Request, { params}: { params: { id: string } }) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', params.id);
    if (error) {
        console.error('Error fetching cart items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }
    return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { cart_items } = await request.json();
    const newItem = cart_items[cart_items.length - 1]; // Assuming the new/updated item is the last one
    console.log(newItem);
    try {
        // First check if this item already exists in the cart
        const { data: existingItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', params.id)
            .eq('menu_item_id', newItem.menu_item_id)
            .single();

        let result;
        
        if (existingItem) {
            // Update existing item
            const { data, error } = await supabase
                .from('cart_items')
                .update({
                    quantity: existingItem.quantity + newItem.quantity,
                    total_price: existingItem.total_price + newItem.total_price
                })
                .eq('cart_id', params.id)
                .eq('menu_item_id', newItem.menu_item_id)
                .select();
                
            if (error) throw error;
            result = data;
        } else {
            // Insert new item
            const { data, error } = await supabase
                .from('cart_items')
                .insert({
                    cart_id: params.id,
                    menu_item_id: newItem.menu_item_id,
                    quantity: newItem.quantity,
                    base_price: newItem.base_price,
                    total_price: newItem.total_price,
                })
                .select();
                
            if (error) throw error;
            result = data;
        }

        // Get all updated cart items
        const { data: updatedCart, error: cartError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', params.id);
            
        if (cartError) throw cartError;

        return NextResponse.json({
            cart_id: params.id,
            cart_items: updatedCart
        });

    } catch (error) {
        console.error('Error in PATCH cart:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}