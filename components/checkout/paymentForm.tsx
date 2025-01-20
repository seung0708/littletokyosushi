'use client';
import {PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { useState } from 'react';
import { CheckoutFormValues } from '@/types/checkout';
import { useAuth } from '@/app/context/authContext';

interface Props {
    total: number;
    formData: CheckoutFormValues;
    cartItems: any[];
}   

const PaymentForm = ({total, formData, cartItems}: Props) => {
    const {user} = useAuth()
    const stripe = useStripe();
    const elements = useElements();
    
    const handlePayment = async () => {
        if (!stripe || !elements) {
            console.error('Stripe or elements not initialized');
            return;
        }
        console.log(formData)
        try {

            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_id: user?.id ?? '',
                    customer: formData.customer,
                    delivery: formData.delivery,
                    cartItems: cartItems,
                    total: total
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();
            console.log('Order created:', orderData);

            console.log('Confirming payment in handlePayment...')
            const {error} = await stripe.confirmPayment({
                elements, 
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation/${orderData.id}`,
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