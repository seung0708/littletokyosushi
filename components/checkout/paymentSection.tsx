'use client'
import { useElements, AddressElement, useStripe } from '@stripe/react-stripe-js';
import { useAuth } from '@/app/context/authContext';
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
}

const PaymentSection = ({ customerAddress, onSubmit, form }: Props) => {
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
            // Get address from Stripe Elements
            const addressElement = elements.getElement('address');
            if (!addressElement) {
                setError('Address form is not properly initialized');
                return;
            }

            const addressDetails = await addressElement.getValue();
            
            if (!addressDetails) {
                setError('Billing address is required');
                return;
            }

            // Save address to customers table if user is logged in
            if (user?.id) {
                const response = await fetch('/api/customers', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: user,
                        address: addressDetails
                    })
                });

                if (!response.ok) {
                    console.error('Error saving address');
                }
            } 
            setLoading(false);
            return addressDetails;
        } catch (error) {
            console.error('Error handling address:', error);
            setError('Error processing address. Please try again.');
            setLoading(false);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            setError('Stripe is not properly initialized. Please refresh the page.');
            return;
        }

        try {
            setLoading(true);
            // Submit the form first to validate all fields
            const { error: submitError } = await elements.submit();
            if (submitError) {
                console.error('Error submitting form:', submitError);
                setLoading(false);
                return;
            }

            const order: Order = await onSubmit(form.getValues());

            // Wait for order data to be available
            if (!order?.short_id || !order?.total) {
                console.error('Order data not available');
                setLoading(false);
                return;
            }
            
            // Create payment intent with order ID
            const paymentIntentResponse = await fetch('/api/payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(order?.total * 100),
                    orderId: order?.short_id
                })
            });

            if (!paymentIntentResponse.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret } = await paymentIntentResponse.json();

            // Confirm payment with the same payment intent
            const { error: confirmError } = await stripe.confirmPayment({
                clientSecret,
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
            });

            if (confirmError) {
                throw new Error(confirmError.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Payment error:', error);
            setError('Error processing payment. Please try again.');
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-100 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                {stripe && elements ? (
                    <PaymentForm 
                        stripe={stripe} 
                        elements={elements} 
                        onAddressSubmit={handleAddressSubmit}
                        onPaymentSubmit={handleSubmit}
                        loading={loading}
                    />
                ) : (
                    <div className="text-center py-4">
                        Loading payment form...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSection;