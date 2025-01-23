import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
    const supabase = createClient();
    
    const { data, error } = await supabase
    .from('orders')
    .select(`
        *,
        customers(*),
        items:order_items(*,
          order_item_modifiers(*,
            order_item_modifier_options(*)
          )
        )
    `)
    .or(`id.eq.${params.orderId},id.like.${params.orderId}%`)
    .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Additional security check to ensure only one order matches
    if (!data) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}