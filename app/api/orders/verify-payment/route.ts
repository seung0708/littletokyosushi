import {NextResponse} from "next/server";
import Stripe from "@/lib/stripe/stripe";
import {createClient} from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { paymentId, paymentIntentSecret } = await req.json();
    const supabase = await createClient();

    try {
        // First verify the payment
        const stripePaymentIntent = await Stripe.paymentIntents.retrieve(paymentId);
        
        if(stripePaymentIntent.status !== 'succeeded' || stripePaymentIntent.client_secret !== paymentIntentSecret) {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        // Get order data from payment intent metadata
        const metadata = stripePaymentIntent.metadata;
        console.log('Payment Intent Metadata:', metadata);

        // Add safety checks
        if (!metadata.customer || !metadata.delivery || !metadata.cart_items || !metadata.fees || !metadata.total || !metadata.address) {
            console.error('Missing metadata:', metadata);
            return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
        }

        try {
            const customer = JSON.parse(metadata.customer);
            const delivery = JSON.parse(metadata.delivery);
            const cartItems = JSON.parse(metadata.cart_items);
            const fees = JSON.parse(metadata.fees);
            const total = JSON.parse(metadata.total);
            const address = JSON.parse(metadata.address);

            // Create the order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_id: metadata.customer_id,
                    customer,
                    delivery,
                    items: cartItems,
                    fees,
                    total,
                    status: 'pending',
                    address
                })
                .select()
                .single();

            if (orderError) {
                console.error('Error creating order:', orderError);
                return NextResponse.json({ error: orderError.message }, { status: 400 });
            }

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
                console.error('Error creating payment record:', paymentError);
                return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
            }

            // Insert status record
            const {error: statusError} = await supabase
                .from('order_status_history')
                .insert([
                    {
                        order_id: orderData.id,
                        status: 'paid',
                        notes: 'Payment successfully processed'
                    },
                    {
                        order_id: orderData.id,
                        status: 'not_started',
                        notes: 'Order ready for kitchen'
                    }
                ]);

            if (statusError) {
                console.error('Error updating order status:', statusError);
                return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
            }
            
            // Update order status
            const {error: orderErrorUpdate} = await supabase
                .from('orders')
                .update({
                    status: 'not_started',
                })
                .eq('id', orderData.id);

            if (orderErrorUpdate) {
                console.error('Error updating order status:', orderErrorUpdate);
                return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
            }
    
            // Clear the cart after successful payment verification
            if (metadata.customer_id) {
                const { error: cartError } = await supabase
                    .from('carts')
                    .delete()
                    .eq('customer_id', metadata.customer_id);

                if (cartError) {
                    console.error('Error clearing cart:', cartError);
                }
            }

            return NextResponse.json({ success: true, orderId: orderData.id });

        } catch (parseError) {
            console.error('Error parsing metadata:', parseError);
            return NextResponse.json({ error: 'Invalid metadata format' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }
}