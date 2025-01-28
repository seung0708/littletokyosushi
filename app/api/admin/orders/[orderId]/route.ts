import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendPrepTimeNotificationEmail, sendOrderReadyNotificationEmail } from "@/lib/email-smtp";

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
    .from('orders')
    .select(`
        *,
        customers(*),
        order_items(*,
          menu_items(*), 
          order_item_modifiers(*,
            modifiers(*),
            order_item_modifier_options(*, 
              modifier_options(*))
          )
        )
    `)
    .eq('short_id', orderId)
    .eq('archived', false)
    .single();

    const order = {
      id: data?.id,
      short_id: data?.short_id,
      status: data?.status,
      type: data?.order_type,
      total: data?.total,
      pickupDate: data?.pickup_date,
      pickupTime: data?.pickup_time, 
      deliveryDate: data?.delivery_date,
      deliveryTime: data?.delivery_time,
      deliveryService: data?.delivery_service,
      prepTime: data?.prep_time_minutes,
      prepTimeConfirmedAt: data?.prep_time_confirmed_at,
      staffNotes: data?.staff_notes,
      subtotal: data?.sub_total,
      serviceFee: data?.service_fee,

      customerId: data?.customers.id,
      customerEmail: data?.customers.email,
      customerFirstName: data?.customers.first_name,
      customerLastName: data?.customers.last_name,
      customerPhone: data?.customers.phone,
      customerAddress: data?.customers.address,
      customerCity: data?.customers.city,
      customerState: data?.customers.state, 
      customerZip: data?.customers.postal_code,
      items: data?.order_items.map((item: any) => ({
        id: item.id,
        price: item.price, 
        quantity: item.quantity,
        name: item.item_name,
        description: item.menu_items.description,
        itemModifiers: item.order_item_modifiers.map((modifier: any) => ({
          id: modifier.id,
          name: modifier.modifier_name,
          options: modifier.order_item_modifier_options.map((option: any) => ({
            id: option.id,
            name: option.modifier_options.name,
            price: option.modifier_options.price
          }))
        }))
      }))
     
    }

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Additional security check to ensure only one order matches
    if (!data) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = await params;
    const { prepTime, status } = await req.json();
    const supabase = await createClient();

    try {
        if (prepTime) {
            // Existing prep time update logic
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .update({
                    prep_time_minutes: prepTime,
                    prep_time_confirmed_at: new Date(),
                    status: 'preparing'
                })
                .eq('short_id', orderId);

            if (orderError) throw orderError;

            // Send email notification
            const { data: order } = await supabase
                .from('orders')
                .select('*, customers(*)')
                .eq('short_id', orderId)
                .single();

            if (order) {
                await sendPrepTimeNotificationEmail(order, order.customers);
            }
        } else if (status === 'ready') {
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .update({
                    status: 'ready',
                    ready_at: new Date()
                })
                .eq('short_id', orderId);

            if (orderError) throw orderError;

            // Fetch the updated order with customer data for email
            const { data: order } = await supabase
                .from('orders')
                .select('*, customers(*)')
                .eq('short_id', orderId)
                .single();

            if (order) {
                await sendOrderReadyNotificationEmail(order, order.customers);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}