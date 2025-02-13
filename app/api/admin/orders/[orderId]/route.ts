import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { 
    sendOrderCompletedEmail,
    sendPrepTimeNotificationEmail,
    sendOrderReadyNotificationEmail
} from '@/lib/email-smtp';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = params;
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

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = params;
    console.log(orderId);
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

        if (status) {
            if (status === 'ready' && !currentOrder.prep_time_confirmed_at) {
                return NextResponse.json({ 
                    error: 'Cannot mark order as ready before setting prep time' 
                }, { status: 400 });
            }

            if (status === 'completed' && currentOrder.status !== 'ready') {
                return NextResponse.json({ 
                    error: 'Can only complete orders that are ready' 
                }, { status: 400 });
            }
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