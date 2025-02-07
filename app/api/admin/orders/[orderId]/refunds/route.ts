import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import {sendRefundNotificationEmail} from '@/lib/email-smtp';

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
                order_refunds(amount)
            `)
            .eq('short_id', orderId)
            .single();

        if (orderError) {
            throw orderError;
        }

        // Calculate total refunded amount
        const totalRefunded = order.order_refunds?.reduce((sum: number, refund: { amount: number; }) => sum + refund.amount, 0) || 0;
        const remainingAmount = order.total - totalRefunded;

        if (amount > remainingAmount) {
            return NextResponse.json({ 
                error: `Cannot refund more than remaining amount: $${remainingAmount.toFixed(2)}` 
            }, { status: 400 });
        }

        // Process the refund
        const { data: newRefund, error: refundError } = await supabase
            .from('order_refunds')
            .insert({
                order_id: order.id,
                amount: amount,
                reason: reason,
                processed_by: order.employee_id // Assuming we have this from auth
            })
            .select()
            .single();

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