import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import { Database } from "@/types/database.types";

type OrderUpdate = Partial<Database['public']['Tables']['orders']['Update']>;

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = params; 
    const supabase = await createClient();
    try {
        const {data: orderData, error: orderError} = await supabase
            .from('orders')
            .select(`*, customers(*), order_items(*, order_item_modifiers(*, order_item_modifier_options(*)))`)
            .eq('short_id', orderId)
            .single();
        
        if (orderError) {
            console.error('Error fetching order data:', orderError);
            return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
        }

        if (!orderData) {
            console.error('No order data found for ID:', orderId);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order data fetched successfully', status: 200, orderData});

    } catch (error) {
        console.error('Error in GET /api/orders/[orderId]:', error); 
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    try {
      const body = await req.json();
      const { orderId } = await params;
      const supabase = await createClient();
      const updateData: OrderUpdate = {};
      
      if (body.status) {
        updateData.status = body.status;
        
        if (body.status === 'completed') {
          updateData.archived = true;
        } else if (body.status === 'ready') {
          updateData.status = 'ready';
        }
      }
      
      if (body.prepTime) {
        updateData.prep_time_minutes = body.prepTime;
        updateData.prep_time_confirmed_at = new Date().toISOString();
        
        if (!body.status) {
          updateData.status = 'preparing';
        }
      }

      const { data: currentOrder, error: fetchError } = await supabase
        .from('orders')
        .select()
        .eq('short_id', orderId)
        .single();

      if (fetchError) throw fetchError;

      const { short_id, ...cleanedOrder } = currentOrder;
      const mergedData = { 
        ...cleanedOrder,
        ...updateData,
        type: currentOrder.type
      };

      const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update(mergedData)
        .eq('short_id', orderId)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}