import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import stripe from "@/lib/stripe/stripe";

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('order_refunds')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

  return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = await params;
    try {
        const { amount, reason } = await request.json();
        const supabase = await createClient();

        // 1. Get order and existing refunds
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                *,
                order_refunds (
                    amount
                )   
            `)
            .eq('short_id', orderId)
            .single();
        
        const { data: orderPayment, error: orderPaymentError } = await supabase
            .from('order_payments')
            .select('*')
            .eq('order_id', order.id)
            .single();
        
        if (orderPaymentError) throw orderPaymentError;
        if (!orderPayment.payment_intent_id) throw new Error('No payment found for this order');
        
        // 2. First check - amount cannot exceed subtotal
        if (amount > order.sub_total) {
            throw new Error(`Cannot refund more than order subtotal: $${order.sub_total}`);
        }

        // 3. If there are previous refunds, check remaining amount
        let remainingRefundable = order.sub_total;
        if (order.order_refunds && order.order_refunds.length > 0) {
            const totalRefunded = order.order_refunds.reduce(
                (sum: number, {amount}: {amount: number}) => sum + amount, 
                0
            );
            remainingRefundable = order.sub_total - totalRefunded;
            
            if (amount > remainingRefundable) {
                throw new Error(`Cannot refund more than remaining amount: $${remainingRefundable}`);
            }
        }

        // 4. Create Stripe refund
        const refund = await stripe.refunds.create({
            payment_intent: orderPayment.payment_intent_id,
            amount: Math.round(amount * 100),
            reason: 'requested_by_customer',
            metadata: {
                reason,
                order_id: order.id,
                refund_number: (order.order_refunds?.length || 0) + 1
            }
        });

        // 5. Record refund in database
        const { data: newRefund, error: refundError } = await supabase
            .from('order_refunds')
            .insert({
                order_id: orderId,
                amount,
                reason,
                stripe_refund_id: refund.id,
                status: refund.status,
                refunded_by: 'admin'
            })
            .select()
            .single();

        if (refundError) throw refundError;

        // 6. Update order status if fully refunded

        const newRemainingAmount = remainingRefundable - amount;
        console.log('New remaining amount:', newRemainingAmount);
        if (Math.abs(newRemainingAmount) < 0.01) {  // If $0 left to refund
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: 'refunded' })
                .eq('short_id', orderId);

            if (updateError) throw updateError;
        }

        return NextResponse.json({
            message: 'Refund processed successfully',
            refund: newRefund,
            remaining_amount: remainingRefundable - amount
        });

    } catch (error: any) {
        console.error('Error processing refund:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process refund' },
            { status: 400 }
        );
    }
}