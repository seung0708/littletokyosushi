import stripe from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { amount, orderId } = await request.json();
        console.log('POST /api/payment-intent ', { amount, orderId });
        if (!amount) {
            return NextResponse.json(
                { error: 'Amount is required' },
                { status: 400 }
            );
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ['card'],
            metadata: {
                order_id: orderId
            }
        });

        console.log('Created payment intent:', { 
            id: paymentIntent.id, 
            clientSecret: paymentIntent.client_secret,
            metadata: paymentIntent.metadata 
        });

        return NextResponse.json({ 
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error("Error creating payment intent:", {
            error,
            amount: request.body
        });
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}