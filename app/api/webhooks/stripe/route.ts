import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import {Database} from '@/types/database.types';

type OrderItem = Database['public']['Tables']['order_items']['Row'];

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    try {
        // 1. Verify webhook signature
        const event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        // 2. Handle successful payments
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const metadata = paymentIntent.metadata;

            // 3. Parse metadata
            const orderData = {
                customer_id: metadata.customer_id,
                customer: JSON.parse(metadata.customer),
                delivery: JSON.parse(metadata.delivery),
                cartItems: JSON.parse(metadata.cart_items),
                fees: JSON.parse(metadata.fees),
                total: JSON.parse(metadata.total),
                address: JSON.parse(metadata.address)
            };

            // 4. Create order in database
            const supabase = await createClient();
            const { data: order} = await supabase
                .from('orders')
                .insert({
                    customer_id: orderData.customer_id,
                    pickup_date: orderData.delivery.pickupDate,
                    pickup_time: orderData.delivery.pickupTime,
                    total: orderData.total,
                    service_fee: orderData.fees.serviceFee,
                    sub_total: orderData.fees.subTotal,
                    billing_address: orderData.address // Store billing address
                })
                .select()
                .single();

            // 5. Create order items
            if (order) {
                await supabase
                    .from('order_items')
                    .insert(
                        orderData.cartItems.map((item: OrderItem) => ({
                            order_id: order.id,
                            item_id: item.item_id,
                            quantity: item.quantity,
                            item_name: item.item_name,
                            price: item.price
                        }))
                    );
            }
        }

        return new Response(JSON.stringify({ received: true }));
    } catch (err) {
        console.log(err);
        return new Response(
            JSON.stringify({ error: 'Webhook error' }), 
            { status: 400 }
        );
    }
}