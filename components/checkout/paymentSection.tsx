'use client'
import { useElements, AddressElement, useStripe, Elements } from '@stripe/react-stripe-js';
import { useAuth } from '@/app/context/authContext';
import { useCart } from '@/app/context/cartContext';
import PaymentForm from './paymentForm';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormValues } from '@/types/checkout'; 
import { Order } from '@/types/order';
import {CustomerAddress} from '@/types/customer';
import { useState, useEffect } from 'react';

interface Props {
    customerAddress?: CustomerAddress | null;
    onSubmit: (data: CheckoutFormValues) => Promise<Order>; 
    form: UseFormReturn<CheckoutFormValues>; 
    orderTotal?: number;
}

const PaymentSection = ({ customerAddress, onSubmit, form, orderTotal }: Props) => {
    console.log(form)
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!stripe || !elements) {
            setError('Stripe is not properly initialized. Please refresh the page.');
        } else {
            setError(null);
        }
    }, [stripe, elements]);

    const handleAddressSubmit = async () => {
        if (!elements) {
            setError('Payment form is not properly initialized');
            return;
        }
        try {
            setLoading(true);

            const addressElement = elements.getElement('address');
            const result = await addressElement.getValue();
            
            // Save address to customers table if user is logged in
            if (user?.id) {
                const response = await fetch('/api/customers', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: user,
                        address: result.value
                    })
                });

                if (!response.ok) {
                    console.error('Error saving address');
                }
            } 
            setLoading(false);
            return {
                value: result.value,
                complete: result.complete,
                isNewAddress: true // Since we're saving it, we can consider it new
            };
        } catch (error) {
            console.error('Error handling address:', error);
            setError('Error processing address information');
            setLoading(false);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            console.error('Stripe not initialized');
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            // Submit the form first
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message);
                setLoading(false);
                return;
            }
    
            // Create temporary order
            const tempOrder: Order = await onSubmit(form.getValues());
            
            if (!tempOrder?.short_id) {
                throw new Error('Failed to create temporary order');
            }
    
            // Create payment intent with order ID
            const paymentIntentResponse = await fetch('/api/payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(orderTotal * 100),
                    orderId: tempOrder.short_id
                })
            });
    
            if (!paymentIntentResponse.ok) {
                throw new Error('Failed to create payment intent');
            }
    
            const { clientSecret } = await paymentIntentResponse.json();
    
            // Confirm payment and redirect
            const { error: paymentError } = await stripe.confirmPayment({
                clientSecret,
                elements,
                redirect: 'always',
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
            });
    
            if (paymentError) {
                setError(paymentError.message);
                setLoading(false);
                return;
            }
    
        } catch (error) {
            console.error('Payment error:', error);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };
    
    return (
        <div className="mt-6">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                {error && (
                    <div className="mb-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
                <PaymentForm 
                        stripe={stripe} 
                        elements={elements} 
                        onAddressSubmit={handleAddressSubmit}
                        onPaymentSubmit={handleSubmit}
                        form={form}
                        customerAddress={customerAddress}
                    />
            </div>
        </div>
    );
};

export default PaymentSection;