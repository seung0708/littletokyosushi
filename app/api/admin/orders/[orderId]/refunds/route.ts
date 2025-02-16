import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import {sendRefundNotificationEmail} from '@/lib/email-smtp';
import stripe from "@/lib/stripe/stripe";

export async function GET(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
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

export async function POST(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    try {
        const { amount, reason } = await request.json();
        const supabase = await createClient();
        // Validate input
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid refund amount' }, { status: 400 });
        }

        if (!reason?.trim()) {
            return NextResponse.json({ error: 'Refund reason is required' }, { status: 400 });
        }

        // Get order and existing refunds
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                *,
                customers(*),
                order_payments(payment_intent_id),
                order_refunds(amount)
            `)
            .eq('short_id', orderId)
            .single();
        
        if (orderError) {
            throw orderError;
        }

        if(!order?.order_payments?.[0]?.payment_intent_id) {
            return NextResponse.json({ error: 'Order has not been paid for' }, { status: 400 });
        }

        // Calculate total refunded amount
        const totalRefunded = order.order_refunds?.reduce((sum: number, refund: { amount: number; }) => sum + refund.amount, 0) || 0;
        const remainingAmount = order.total - totalRefunded;

        if (amount > remainingAmount) {
            return NextResponse.json({ 
                error: `Cannot refund more than remaining amount: $${remainingAmount.toFixed(2)}` 
            }, { status: 400 });
        }

        const refund = await stripe.refunds.create({
            payment_intent: order.order_payments?.[0]?.payment_intent_id,
            amount: Math.round(amount * 100),
            reason: 'requested_by_customer'
        });
        
        if (refund.status !== 'succeeded') {
            console.error('Stripe refund failed:', refund);
            return NextResponse.json({ 
                error: `Stripe refund failed with status: ${refund.status}` 
            }, { status: 400 });
        }

        // Process the refund
        const { data: newRefund, error: refundError } = await supabase
            .from('order_refunds')
            .insert({
                order_id: order.short_id,
                amount: amount,
                reason: reason,
                stripe_refund_id: refund.id, 
                status: refund.status, 
                refunded_by: 'admin'
            })
            .select()
            .single();
        console.log('New refund:', newRefund);
        if (refundError) {
            throw refundError;
        }

        // Update order total if needed
        if (amount === remainingAmount) {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: 'refunded' })
                .eq('id', order.id);

            if (updateError) throw updateError;
        }

        if(newRefund && refund.status === 'succeeded') {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ 
                    total: remainingAmount - amount, 
                })
                .eq('id', order.id);
            if (updateError) throw updateError;

            const { error: paymentError } = await supabase
                .from('order_payments')
                .update({ payment_status: 'refunded' })
                .eq('order_id', order.id);
            if (paymentError) throw paymentError;

            const { error: orderStatusError } = await supabase
                .from('order_status_history')
                .insert({
                    order_id: order.id,
                    status: 'refunded',
                    notes: `Refunded ${amount}`
                })
            if (orderStatusError) throw orderStatusError
        }
            

        // Send email notification
        if (order?.customers) {
            const emailResult = await sendRefundNotificationEmail(order, order.customers, amount);
            if (!emailResult.success) {
                console.error('Failed to send refund notification email:', emailResult.error);
                // Continue with the refund process even if email fails
            }
        }

        return NextResponse.json({
            message: 'Refund processed successfully',
            refund: newRefund,
            remainingAmount: remainingAmount - amount
        });
    } catch (error) {
        console.error('Error processing refund:', error);
        return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 });
    }
}