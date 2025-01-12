'use client';
import {PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { useState } from 'react';

interface Props {
    orderId: string;
    clientSecret: string;
    onPaymentComplete: () => void;
}   

const PaymentForm = ({ onPaymentComplete, orderId, clientSecret}: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const handlePayment = async () => {
        if (!stripe || !elements) {
            console.error('Stripe or elements not initialized');
            return;
        }

        try {
            console.log('Confirming payment in handlePayment...')
            const {error} = await stripe.confirmPayment({
                elements, 
                confirmParams: {
                    return_url: `${window.location.origin}/order/${orderId}`
                }
            });
            return !error;
        } catch (error) {
            console.error('Error confirming payment:', error);
            return false;
        } 
    };

    return (
        <div className="flex flex-col space-y-4">
            <PaymentElement />
            <Button
                type="submit"
                disabled={!stripe}
                className="mt-4"
                onClick={handlePayment}
            >
                Pay Now
            </Button>
        </div>
    )
}

export default PaymentForm;