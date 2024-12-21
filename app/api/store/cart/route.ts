import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server"; 
import { custom } from "zod";

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { customer_id } = await request.json();
        const { error } = await supabase
            .from('carts')
            .insert(
                {
                    customer_id: customer_id || null
                }
            );
        if (error) {
            console.error('Error creating cart:', error);
            return NextResponse.json(
                { error: 'Failed to create cart' },
                { status: 500 }
            );
        }
        if (!error) {
            const { data, error } = await supabase
                .from('carts')
                .select('*, cart_items(*)')
                .limit(1)
            
            const cart = data?.[0]
            return NextResponse.json(cart);
        }
    } catch (error) {
        console.error('Error in cart items API:', error);
        return NextResponse.json(    
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }    
}

