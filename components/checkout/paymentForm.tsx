'use client'

import { PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { useState } from 'react';
import { StripeAddressElementChangeEvent, StripeElements, Stripe } from '@stripe/stripe-js';
import { CustomerAddress } from '@/types/customer';
import { User } from '@/types/user';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormValues } from '@/types/checkout';
import { useAuth } from '@/app/context/authContext';

interface Props {
    stripe: Stripe | null;
    elements: StripeElements | null;
    onAddressSubmit: () => Promise<Pick<StripeAddressElementChangeEvent, "value" | "complete" | "isNewAddress"> | null | undefined>;
    onPaymentSubmit: () => Promise<void>;
    form: UseFormReturn<CheckoutFormValues>;
    customerAddress: CustomerAddress | null;
}

const PaymentForm = ({ stripe, elements, onAddressSubmit, onPaymentSubmit, form, customerAddress }: Props) => {
    const { user } = useAuth();
    const { customer, delivery } = form.watch();
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
        <div className="flex flex-col space-y-4 bg-black/30 [&_.Input]:!bg-black [&_.Block]:!bg-black">
            <AddressElement 
                options={{
                    mode: 'billing',
                    fields: {
                        phone: 'always',
                    },
                    validation: {
                        phone: {
                            required: 'always'
                        }
                    },
                    defaultValues: {
                        name: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`,
                        phone: customer?.phone || '',
                        address: {
                            line1: customerAddress?.line1 || '',
                            line2: customerAddress?.line2 || '',
                            city: customerAddress?.city || '',
                            state: customerAddress?.state || '',
                            postal_code: customerAddress?.postal_code || '',
                            country: customerAddress?.country || 'US',
                        }
                    },
                }}
            />
            <PaymentElement />
            {/* {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                    <p className="text-red-400">{error}</p>
                </div>
            )} */}
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