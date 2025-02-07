import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { 
    sendOrderCompletedEmail,
    sendPrepTimeNotificationEmail,
    sendOrderReadyNotificationEmail
} from '@/lib/email-smtp';
import { Database } from "@/types/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  customers: Database["public"]["Tables"]["customers"]["Row"];
  items: (Database["public"]["Tables"]["order_items"]["Row"] & {
    order_item_modifiers: (Database["public"]["Tables"]["order_item_modifiers"]["Row"] & {
      modifiers: Database["public"]["Tables"]["modifiers"]["Row"];
      order_item_modifier_options: (Database["public"]["Tables"]["order_item_modifier_options"]["Row"] & {
        modifier_options: Database["public"]["Tables"]["modifier_options"]["Row"];
      })[];
    })[];
  })[];
};

type OrderItem = Database["public"]["Tables"]["order_items"]["Row"] & {
  order_item_modifiers: (Database["public"]["Tables"]["order_item_modifiers"]["Row"] & {
    modifiers: Database["public"]["Tables"]["modifiers"]["Row"];
    order_item_modifier_options: (Database["public"]["Tables"]["order_item_modifier_options"]["Row"] & {
      modifier_options: Database["public"]["Tables"]["modifier_options"]["Row"];
    })[];
  })[];
};

type OrderItemModifier = Database["public"]["Tables"]["order_item_modifiers"]["Row"] & {
  modifiers: Database["public"]["Tables"]["modifiers"]["Row"];
  order_item_modifier_options: (Database["public"]["Tables"]["order_item_modifier_options"]["Row"] & {
    modifier_options: Database["public"]["Tables"]["modifier_options"]["Row"];
  })[];
};

type OrderItemModifierOption = Database["public"]["Tables"]["order_item_modifier_options"]["Row"] & {
  modifier_options: Database["public"]["Tables"]["modifier_options"]["Row"];
};

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
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
    .single();  // Remove the archived filter to get both types

    const order: Order = {
        id: data?.id,
        customer_id: data?.customers_id,
        status: data?.status,
        order_type: data?.order_type,
        delivery_service: data?.delivery_service,
        delivery_date: data?.delivery_date,
        delivery_time: data?.delivery_time,
        pickup_date: data?.pickup_date,
        pickup_time: data?.pickup_time, 
        staff_notes: data?.staff_notes,
        total: data?.total,
        sub_total: data?.sub_total,
        service_fee: data?.service_fee,
        ready_at: data?.ready_at,
        completed_at: data?.completed_at,
        archived: data?.archived,
        customers: data?.customers,
        items: data?.order_items.map((item: OrderItem) => ({
            id: item.id,
            price: item.price,  
            quantity: item.quantity, 
            name: item.item_name, 
            menu_items: item.special_instructions,
            order_item_modifiers: item.order_item_modifiers.map((mod: OrderItemModifier) => ({
                id: mod.id, 
                name: mod.modifier_name,
                options: mod.order_item_modifier_options.map((opt: OrderItemModifierOption) => ({
                    id: opt.id,
                    name: opt.option_name,
                    price: opt.option_price
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
    console.log(data, error);
    return NextResponse.json(data);
}

// app/api/admin/orders/[orderId]/route.ts
export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const { prepTime, status } = await req.json();
    const supabase = await createClient();

    try {
        // Get current order data first for comparison
        const { data: currentOrder } = await supabase
            .from('orders')
            .select('*, customers(*)')
            .eq('short_id', orderId)
            .single();

        if (!currentOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Validate status transitions
        if (status) {
            // Can't mark as ready without prep time
            if (status === 'ready' && !currentOrder.prep_time_confirmed_at) {
                return NextResponse.json({ 
                    error: 'Cannot mark order as ready before setting prep time' 
                }, { status: 400 });
            }

            // Can't complete an order that's not ready
            if (status === 'completed' && currentOrder.status !== 'ready') {
                return NextResponse.json({ 
                    error: 'Can only complete orders that are ready' 
                }, { status: 400 });
            }
        }

        // Validate prep time
        if (prepTime) {
            if (prepTime <= 0) {
                return NextResponse.json({ 
                    error: 'Prep time must be greater than 0 minutes' 
                }, { status: 400 });
            }
        }

        let updateData = {};

        if (prepTime) {
            updateData = {
                prep_time_minutes: prepTime,
                prep_time_confirmed_at: new Date(),
                status: 'preparing'
            };
        } else if (status === 'ready') {
            updateData = {
                status: 'ready',
                ready_at: new Date()
            };
        } else if (status === 'completed') {
            updateData = {
                status: 'completed',
                completed_at: new Date(),
                archived: true
            };
        }

        // Update the order
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update(updateData)
            .eq('short_id', orderId)
            .select('*, customers(*)')
            .single();

        if (updateError) throw updateError;

        // Send appropriate email notifications
        if (updatedOrder && updatedOrder.customers) {
            let emailResult;
            
            if (prepTime) {
                emailResult = await sendPrepTimeNotificationEmail(updatedOrder, updatedOrder.customers);
            } else if (status === 'ready') {
                emailResult = await sendOrderReadyNotificationEmail(updatedOrder, updatedOrder.customers);
            } else if (status === 'completed') {
                emailResult = await sendOrderCompletedEmail(updatedOrder, updatedOrder.customers);
            }

            if (emailResult && !emailResult.success) {
                console.error('Failed to send email notification:', emailResult.error);
                // Continue with the order update even if email fails
            }
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}