import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) { 
  const { searchParams } = new URL(req.url);
  const not_started = searchParams.get('not_started');
  const completed = searchParams.get('completed');
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
      .order('created_at', { ascending: false });

    // If completed is true, show only completed orders
    if (completed === 'true') {
      query.eq('status', 'completed')
          .eq('archived', true);
    } else if (not_started) {
      query.eq('status', 'not_started');
    }
    
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      orders: data,
      totalPages: count ? Math.ceil(count / per_page) : 0,
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}