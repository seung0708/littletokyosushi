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
import { useRouter } from 'next/navigation';

interface Props {
    customerAddress?: CustomerAddress | null;
    onSubmit: (data: CheckoutFormValues) => Promise<Order>; 
    form: UseFormReturn<CheckoutFormValues>; 
    orderTotal?: number;
}

const PaymentSection = ({ customerAddress, onSubmit, form, orderTotal }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const { clearCart } = useCart();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            setError('Stripe is not properly initialized');
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const { error: submitError } = await elements.submit();
            if (submitError) {
                console.error('Error submitting form:', submitError);
                setLoading(false);
                return;
            }
            const addressDetails = await handleAddressSubmit();
            if (!addressDetails) {
                setLoading(false);
                return;
            }
    
            const { error: elementsError } = await elements.submit();
            if (elementsError) {
                setError(elementsError.message);
                setLoading(false);
                return;
            }

            const paymentIntentResponse = await fetch('/api/payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(orderTotal * 100)
                })
            });

            if (!paymentIntentResponse.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret } = await paymentIntentResponse.json();

            const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
                clientSecret,
                elements,
                redirect: 'if_required',
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,

                },
            });
    
            if (paymentError) {
                setError(paymentError.message);
                setLoading(false);
                return;
            }
    

            if (paymentIntent.status === 'succeeded') {
                // Call the passed in onSubmit with form data
                const order: Order = await onSubmit(form.getValues());
                if (!order?.short_id || !order?.total) {
                    console.error('Order data not available');
                    setLoading(false);
                    return;
                }
                // Store order ID and redirect
                localStorage.setItem('lastCompletedOrder', order.short_id);
                // Clear cart data
                clearCart();
                localStorage.removeItem('cartId');
                localStorage.removeItem('cartItems');
                router.replace(`/order-confirmation?id=${order.short_id}`);
            } else {
                setError('Payment was not completed. Please try again.');
                setLoading(false);
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