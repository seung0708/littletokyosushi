'use client'
import { useElements, AddressElement, useStripe } from '@stripe/react-stripe-js';
import { useAuth } from '@/app/context/authContext';
import PaymentForm from './paymentForm';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormValues } from '@/types/checkout'; 
import { useState } from 'react';


interface Props {
    customerAddress: any;
    onSubmit: (data: CheckoutFormValues) => Promise<void>; 
    form: UseFormReturn<CheckoutFormValues>; 
    order: any;
}

const PaymentSection = ({ customerAddress, onSubmit, form, order }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleAddressSubmit = async () => {
        if (!elements) return;

        try {
            // Get address from Stripe Elements
            const addressElement = elements.getElement('address');
            const addressDetails = await addressElement?.getValue();
    
            if (!addressDetails) {
                throw new Error('Billing address is required');
            }

            // Save address to customers table if user is logged in
            if (user?.id) {
                const response = await fetch('/api/customers', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: user.id,
                        address: addressDetails
                    })
                });

                if (!response.ok) {
                    console.error('Error saving address');
                }
            }

            return addressDetails;
        } catch (error) {
            console.error('Error handling address:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        console.log('Payment form submitted');
        
        if (!stripe || !elements) {
            console.error('Stripe not initialized');
            return;
        }

        try {
            setProcessing(true);
            setError(null);

            // Submit the form first to validate all fields
            const { error: submitError } = await elements.submit();
            if (submitError) {
                console.error('Error submitting form:', submitError);
                return;
            }

            
            await onSubmit(form.getValues());

             // Wait for order data to be available
            if (!order?.short_id || !order?.total) {
                console.error('Order data not available');
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
            console.log('Created payment intent with client secret');

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
        } catch (error) {
            console.error('Payment error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setProcessing(false);
        }
    };
    return (
        <div className="space-y-4">
            <h2 className="text-red-500 text-3xl pb-6">Billing Address</h2>
            <AddressElement 
                options={{
                    mode: 'billing',
                    allowedCountries: ['US'],
                    autocomplete: { mode: 'automatic' },
                    defaultValues: {
                        address: {
                            line1: customerAddress?.line1 || '',
                            line2: customerAddress?.line2 || '',
                            city: customerAddress?.city || '',
                            state: customerAddress?.state || '',
                            postal_code: customerAddress?.postal_code || '',
                            country: customerAddress?.country || 'US',
                        },
                        phone: customerAddress?.phone || ''
                    },
                    fields: { phone: 'always' },
                    validation: { phone: { required: 'always' } },
                }}
            />
            <PaymentForm onAddressSubmit={handleAddressSubmit} onPaymentSubmit={handleSubmit} />
        </div>
    );
};

export default PaymentSection;