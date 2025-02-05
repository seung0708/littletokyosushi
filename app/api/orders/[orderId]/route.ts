import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = await params;
    const supabase = await createClient();
    
    try {
        const {data: orderData, error: orderError} = await supabase
            .from('orders')
            .select(`*, order_items(*, order_item_modifiers(*, order_item_modifier_options(*)))`)
            .eq('id', orderId)
            .single();
        
        if (orderError) {
            console.error('Error fetching order data:', orderError);
            return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
        }

        if (!orderData) {
            console.error('No order data found for ID:', params.orderId);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order data fetched successfully', status: 200, orderData});

    } catch (error) {
        console.error('Error in GET /api/orders/[orderId]:', error); 
        return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
    }
}

// app/api/orders/[orderId]/route.ts
export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
    try {
      const body = await req.json();
      const supabase = await createClient();
      const {orderId} = await params;
      const updateData: any = {};
      
      // Handle status updates first
      if (body.status) {
        updateData.status = body.status;
        
        // Add additional fields based on status
        if (body.status === 'completed') {
          updateData.archived = true;
          updateData.completed_at = new Date().toISOString();
        } else if (body.status === 'ready') {
          // Only update status for ready
          updateData.status = 'ready';
        }
      }
      
      // Handle prep time updates separately
      if (body.prepTime) {
        updateData.prep_time = body.prepTime;
        updateData.prep_start_time = new Date().toISOString();
        // Only set status to preparing if it's a prep time update
        if (!body.status) {
          updateData.status = 'preparing';
        }
      }

      // First get the current order with all related data
      const { data: currentOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`*`)
        .eq('short_id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Remove generated columns and merge data
      const { short_id, created_at, ...cleanedOrder } = currentOrder;
      const mergedData = { 
        ...cleanedOrder,
        ...updateData,
        type: currentOrder.type // Explicitly preserve the type field
      };

      // Update with merged data
      const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update(mergedData)
        .eq('short_id', orderId)
        .select(`*`)
        .single();
  
      if (error) throw error;
  
      return NextResponse.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }
}