import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { 
    sendOrderCompletedEmail,
    sendPrepTimeNotificationEmail,
    sendOrderReadyNotificationEmail
} from '@/lib/email-smtp';
import { isValidTransition } from "@/utils/orderState";

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
    .single(); 

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const { prepTime, status } = await req.json();
    const supabase = await createClient();

    try {
        const { data: currentOrder } = await supabase
            .from('orders')
            .select('*, customers(*)')
            .eq('short_id', orderId)
            .single();

        if (!currentOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (status && !isValidTransition(currentOrder.status, status)) {
            return NextResponse.json({ 
                error: `Invalid transition from ${currentOrder.status} to ${status}` 
            }, { status: 400 });
        }

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
                prep_time: prepTime,
                prep_time_started_at: new Date(),
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
            };
        }   

        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update(updateData)
            .eq('short_id', orderId)
            .select(`*, 
                customers(*), 
                order_items(*,
                  menu_items(*), 
                  order_item_modifiers(*,
                    modifiers(*),
                    order_item_modifier_options(*, 
                      modifier_options(*))
                  )
                )`)
            .single();

        if (updateError) throw updateError;

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
            }
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}