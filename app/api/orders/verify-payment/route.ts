import {NextResponse} from "next/server";
import Stripe from "@/lib/stripe/stripe";
import {createClient} from "@/lib/supabase/server";
import {retryOperation} from "@/lib/utils/api-retry";

export async function POST(req: Request) {
    const { paymentId, paymentIntentSecret } = await req.json();
    const supabase = await createClient();
    
    try {
        // First get the payment intent to get the order ID
        const paymentIntent = await retryOperation(() => Stripe.paymentIntents.retrieve(paymentId));
        
        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
        }
        
        if(paymentIntent.status !== 'succeeded' || paymentIntent.client_secret !== paymentIntentSecret) {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        const orderId = paymentIntent.metadata.order_id;
        console.log('verify-payment orderId:', orderId)

        if (!orderId) {
            return NextResponse.json({ error: 'No order ID found' }, { status: 400 });
        }

        
        const orderData = await retryOperation(async () =>{ 
            const result = await supabase
                .from('orders')
                .select('*')
                .eq('short_id', orderId)
                .single();

            if (result.error) throw result.error;
            if (!result.data) throw new Error('Order not found');
                
            return result.data;
        });
        
        if (!orderData) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Insert payment record
        await retryOperation(async () => {
            const {error: paymentError } = await supabase
                .from('order_payments')
                .insert({
                    order_id: orderData.id,
                    payment_intent_id: paymentIntent.id, 
                    payment_status: paymentIntent.status,
                    payment_method: paymentIntent.payment_method_types[0],
                    amount: paymentIntent.amount,
                });
            
                if (paymentError) {
                    console.log('verify-payment Error updating payment:', paymentError);
                    throw paymentError;
                }
        })

        // Insert status record
        await retryOperation(async () => {
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
                throw statusError;
            }
        })
        
        await retryOperation(async () => {
            const {error: orderErrorUpdate} = await supabase
                .from('orders')
                .update({
                    status: 'not_started',
                })
                .eq('id', orderData.id);

            if (orderErrorUpdate) {
                console.error('Error updating order status:', orderErrorUpdate);
                throw orderErrorUpdate;
            }
        })

        // Clear the cart after successful payment verification
        await retryOperation(async () => {
            const { error: cartError } = await supabase
                .from('carts')
                .delete()
                .eq('customer_id', orderData.customer_id);

            if (cartError) {
                console.error('Error clearing cart:', cartError);
                throw cartError;
            }
        })

        // Clean up duplicate status records - keep only the latest
        await retryOperation(async () => {
            const latestStatus = await supabase
                .from('order_status_history')
                .select('created_at')
                .eq('order_id', orderData.id)
                .eq('status', 'paid')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (latestStatus.error) {
                console.error('Error getting latest status:', latestStatus.error);
                throw latestStatus.error;
            }

            if (latestStatus.data) {
                const { error: deleteStatusError } = await supabase
                .from('order_status_history')
                .delete()
                .eq('order_id', orderData.id)
                .eq('status', 'paid')
                .lt('created_at', latestStatus.data.created_at);
            
                if (deleteStatusError) {
                    console.error('Error cleaning up duplicate statuses:', deleteStatusError);
                    throw deleteStatusError;
                }
            }
        })

        return NextResponse.json({ 
            message: 'Payment verified successfully', 
            status: 200, 
            orderId: orderData.short_id,
            clearCart: true // Signal to client to clear localStorage
        });
        
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}