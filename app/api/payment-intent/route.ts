import { NextResponse } from "next/server";
import stripe from "@/lib/stripe/stripe";
import { retryOperation } from "@/lib/utils/api-retry";

export async function POST(request: Request) {
    try {
        const { amount, orderId } = await request.json();
        if (!amount || amount <= 0) return NextResponse.json( { error: 'Invalid amount' }, { status: 400 });
        
        const paymentIntent = await retryOperation(() => 
            stripe.paymentIntents.create(
                {
                    amount,
                    currency: "usd",
                    payment_method_types: ['card'],
                    metadata: {
                        order_id: orderId
                    }
                }
            )
        );
        
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