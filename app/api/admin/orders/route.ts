import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) { 
  const { searchParams } = new URL(req.url);
  const archived = searchParams.get('archived') === 'true';
  const not_started = searchParams.get('not_started') === 'true';
  const completed = searchParams.get('completed') === 'true';
  const page = Number(searchParams.get('page')) || 1;
  const per_page = 10;
  
  const supabase = await createClient();

  try {
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
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (completed) {
      query.eq('status', 'completed');
    } else if (not_started) {
      query.eq('status', 'not_started');
    } else if (archived !== undefined) {
      query.eq('archived', archived);
    }
    
    const { data, error, count } = await query;
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      orders: data,
      totalPages: count ? Math.ceil(count / per_page) : 0,
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}