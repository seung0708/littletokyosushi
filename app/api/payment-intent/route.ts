import stripe from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { amount, metadata } = await request.json();
        
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
            metadata: metadata
        });
        
        return NextResponse.json({ 
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error: any) {
        console.error("Error creating payment intent:", {
            error: error.message,
            type: error.type,
            code: error.code,
            amount: request.body
        });
        return NextResponse.json(
            { error: error.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}