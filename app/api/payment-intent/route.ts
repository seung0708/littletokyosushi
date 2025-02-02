import stripe from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();
        
        if (!amount) {
            return NextResponse.json(
                { error: 'Amount is required' },
                { status: 400 }
            );
        }

        console.log('Creating payment intent with amount:', amount);
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ['card'], // Only allow card payments
            automatic_payment_methods: {
                enabled: false, // Disable automatic payment methods
            },
        });
        
        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
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