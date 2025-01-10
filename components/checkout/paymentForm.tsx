'use client';
import {PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { useState } from 'react';

interface Props {
    clientSecret: string;
    onPaymentComplete: () => void;
}   

const PaymentForm = ({ onPaymentComplete}: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    
    const handlePayment = async () => {
        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const {error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message || 'Failed to submit payment details');
                setProcessing(false);
                return false; 
            }
            return true;
        } catch (error) {
            setError('An error occurred while processing your payment.');
            return false;
        } finally {
            setProcessing(false);
        }
        
    };

    return (
        <div className="flex flex-col space-y-4">
            <PaymentElement />
            {error && <p className="text-red-500">{error}</p>}
            <Button
                type="submit"
                disabled={!stripe || processing}
                className="mt-4"
                onClick={async (e) => {
                    e.preventDefault();
                    const success = await handlePayment();
                    if (success) {
                        onPaymentComplete();
                    }
                }}
            >
                {processing ? 'Processing...' : 'Pay'}
            </Button>
        </div>
    )
}

export default PaymentForm;