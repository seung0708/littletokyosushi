import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() { 
    const supabase = await createClient();
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
          .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}