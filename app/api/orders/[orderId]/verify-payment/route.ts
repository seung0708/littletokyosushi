import {NextResponse} from "next/server";
import Stripe from "@/lib/stripe/stripe";
import {createClient} from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
    const { paymentId, paymentIntentSecret } = await req.json();
    console.log('POST /api/orders/[orderId]/verify-payment ', paymentId, paymentIntentSecret);
    const supabase = await createClient();

    try {
        //Get order data
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', params.orderId)
            .single();
        
        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

        const stripePaymentIntent = await Stripe.paymentIntents.retrieve(paymentId);
        
        if(stripePaymentIntent.status !== 'succeeded' || stripePaymentIntent.client_secret !== paymentIntentSecret) {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        console.log('order payments info', stripePaymentIntent.id, stripePaymentIntent.status, stripePaymentIntent.amount, stripePaymentIntent.payment_method_types[0]);

        // Insert payment record
        const {error: paymentError } = await supabase
            .from('order_payments')
            .insert({
                order_id: orderData.id,
                payment_intent_id: stripePaymentIntent.id, 
                payment_status: stripePaymentIntent.status,
                payment_method: stripePaymentIntent.payment_method_types[0],
                amount: stripePaymentIntent.amount,
            });

        if (paymentError) {
            console.log('verify-payment Error updating payment:', paymentError);
        }

        // Insert status record
        const {error: statusError} = await supabase
            .from('order_status_history')
            .insert({
                order_id: params.orderId,
                status: 'paid',
                notes: 'Payment successfully processed'
            });

        if (statusError) {
            console.error('Error updating order status:', statusError);
            return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
        }
        
        const {error: orderErrorUpdate} = await supabase
            .from('orders')
            .update({
                status: 'paid',
            })
            .eq('id', params.orderId);

        if (orderErrorUpdate) {
            console.error('Error updating order status:', orderErrorUpdate);
            return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
        }
 
        // Clear the cart after successful payment verification
        const { error: cartError } = await supabase
            .from('carts')
            .delete()
            .eq('customer_id', orderData.customer_id);

        if (cartError) {
            console.error('Error clearing cart:', cartError);
        }

        // Clean up duplicate payment records - keep only the latest
        const latestPayment = await supabase
            .from('order_payments')
            .select('created_at')
            .eq('order_id', orderData.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (latestPayment.data) {
            const { error: deletePaymentError } = await supabase
                .from('order_payments')
                .delete()
                .eq('order_id', orderData.id)
                .lt('created_at', latestPayment.data.created_at);

            if (deletePaymentError) {
                console.error('Error cleaning up duplicate payments:', deletePaymentError);
            }
        }

        // Clean up duplicate status records - keep only the latest
        const latestStatus = await supabase
            .from('order_status_history')
            .select('created_at')
            .eq('order_id', params.orderId)
            .eq('status', 'paid')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (latestStatus.data) {
            const { error: deleteStatusError } = await supabase
                .from('order_status_history')
                .delete()
                .eq('order_id', params.orderId)
                .eq('status', 'paid')
                .lt('created_at', latestStatus.data.created_at);

            if (deleteStatusError) {
                console.error('Error cleaning up duplicate statuses:', deleteStatusError);
            }
        }

        return NextResponse.json({ 
            message: 'Payment verified successfully', 
            status: 200, 
            orderId: params.orderId,
            clearCart: true // Signal to client to clear localStorage
        });
        
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}