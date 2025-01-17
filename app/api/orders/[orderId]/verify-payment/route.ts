import {NextResponse} from "next/server";
import Stripe from "@/lib/stripe/stripe";
import {createClient} from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
    const supabase = createClient();
    const { paymentId, paymentIntentSecret } = await req.json();
    const stripePaymentIntent = await Stripe.paymentIntents.retrieve(paymentId);

    if(stripePaymentIntent.status !== 'succeeded' || stripePaymentIntent.client_secret !== paymentIntentSecret) {
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    const {data: {user}, error: userError} = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }

    const {data: paymentData, error: paymentError } = await supabase
        .from('order_payments')
        .insert({
            order_id: params.orderId,
            payment_intent_id: paymentId, 
            amount: stripePaymentIntent.amount,
            status: stripePaymentIntent.status, 
            payment_method: stripePaymentIntent.payment_method_types[0],
        })

    console.log('Payment data:', paymentData);

    const {error: statusError} = await supabase
        .from('order_status_history')
        .insert({
            order_id: params.orderId,
            status: 'paid',
            notes: 'Payment successfullly processed'

        })

    if (statusError) {
        console.error('Error updating order status:', statusError);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    const {error: orderError} = await supabase
        .from('orders')
        .update({
            status: 'paid',
        })
        .eq('id', params.orderId);

    if (orderError) {
        console.error('Error updating order status:', orderError);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    const {error: cartError} = await supabase
        .from('carts')
        .delete()
        .eq('customer_id', user?.id);
    
    if (cartError) {
        console.error('Error updating cart:', cartError);
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Payment verified successfully', status: 200, orderId: params.orderId});
 
}

