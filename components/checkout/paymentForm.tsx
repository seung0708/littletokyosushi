'use client';
import {PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { CheckoutFormValues } from '@/types/checkout';
import { useAuth } from '@/app/context/authContext';
import { useSearchParams } from 'next/navigation';

interface Props {
    total: number;
    formData: CheckoutFormValues;
    cartItems: any[];
    fees: {serviceFee: number, subTotal: number};
}   

const PaymentForm = ({total, formData, cartItems, fees}: Props) => {
    const {user} = useAuth()
    const stripe = useStripe();
    const elements = useElements();
    const searchParams = useSearchParams();
    
    const handlePayment = async () => {
        if (!stripe || !elements) return;

        const addressElement = elements.getElement('address');
        const addressDetails = await addressElement?.getValue();

        if(user?.id && addressDetails) {
            await fetch('/api/customers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: user?.id,
                    address: JSON.stringify(addressDetails)
                })
            });
        }

        try {
            // Create payment intent with metadata first
            const response = await fetch('/api/payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(total * 100),
                    metadata: {
                        customer_id: user?.id,
                        customer: JSON.stringify({
                            name: formData.name,
                            email: formData.email
                        }),
                        delivery: JSON.stringify({
                            method: formData.deliveryMethod,
                            pickupDate: formData.pickupDate,
                            pickupTime: formData.pickupTime
                        }),
                        cart_items: JSON.stringify(cartItems),
                        fees: JSON.stringify(fees),
                        total: JSON.stringify(total),
                        address: JSON.stringify(addressDetails)
                    }
                })
            });

            const { clientSecret } = await response.json();
            if (!clientSecret) {
                throw new Error('Failed to create payment intent');
            }

            // Then confirm the payment
            const { error: submitError } = await elements.submit();
            if (submitError) {
                console.error('Error submitting payment:', submitError);
                return;
            }

            const { error: confirmError } = await stripe.confirmPayment({
                elements,
                clientSecret,  // Add this line
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
            });

            if (confirmError) {
                console.error('Error confirming payment:', confirmError);
            }
        } catch (error) {
            console.error('Error:', error);
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