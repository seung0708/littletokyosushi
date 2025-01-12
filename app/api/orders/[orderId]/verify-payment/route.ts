import {NextResponse} from 'next/server'
import stripe from "@/lib/stripe/stripe";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
    try {
        const { paymentId, paymentIntentSecret } = await req.json();
        const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        
        if(stripePaymentIntent.status !== 'succeeded' || stripePaymentIntent.client_secret !== paymentIntentSecret) {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }