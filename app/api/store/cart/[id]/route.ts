import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const {cart_items, customer_id} = await request.json();
        const { data, error } = await supabase
            .from('carts')
            .insert({
                cart_items,
                customer_id
            });
        if (error) {
            console.error('Error creating cart:', error);
            return NextResponse.json(
                { error: 'Failed to create cart' },
                { status: 500 }
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in cart items API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

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
    const body = await request.json();
    const { data, error } = await supabase
        .from('cart_items')
        .update(body)
        .eq('id', params.id);
    if (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json(
            { error: 'Failed to update cart item' },
            { status: 500 }
        );
    }
    return NextResponse.json(data);
}