import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) { 
  const { searchParams } = new URL(req.url);
  const archived = searchParams.get('archived') === 'true';
  const not_started = searchParams.get('not_started') === 'true';
  
  const supabase = await createClient();
  const query = supabase
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
      .order('created_at', { ascending: false })
  // Only apply archived filter if specified
  if (archived !== undefined) {
      query.eq('archived', archived);
  }

  if(not_started === true) {
      query.eq('status', 'not_started');
  }

  const { data, error } = await query;
  
  if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}