import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { useState } from 'react';
import { StripeAddressElementChangeEvent, StripeElements, Stripe } from '@stripe/stripe-js';

interface Props {
    stripe: Stripe | null;
    elements: StripeElements | null;
    onAddressSubmit: () => Promise<Pick<StripeAddressElementChangeEvent, "value" | "complete" | "isNewAddress"> | null | undefined>;
    onPaymentSubmit: () => Promise<void>;
}

const PaymentForm = ({ stripe, elements, onAddressSubmit, onPaymentSubmit }: Props) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!stripe || !elements) {
            console.error('Stripe.js has not loaded');
            return;
        }
        setLoading(true);
        try {
            await onAddressSubmit();
            await onPaymentSubmit();
        } catch (error) {
            console.error('Error processing payment:', error);
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div className="flex flex-col space-y-4">
            <PaymentElement />
            <Button 
                type="button"
                onClick={handlePayment}
                className="w-full bg-red-600 text-white"
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Complete Order'}
            </Button>
        </div>
    );
};

export default PaymentForm;