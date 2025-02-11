'use client'

import Link from 'next/link'

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormValues } from '@/types/checkout'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useCart } from '@/app/context/cartContext'
import { useAuth } from '@/app/context/authContext'
import CheckoutCustomerSignIn from '@/components/checkout/checkoutCustomerSignIn'
import DeliveryPickupSelector from '@/components/checkout/deliverypickupselector';  
import OrderSummary from '@/components/checkout/orderSummary';
import PaymentSection from '@/components/checkout/paymentSection';
import { CustomerAddress } from '@/types/customer';

type CheckoutStep =  'signin' | 'delivery-pickup' | 'summary';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutSteps = () => {
    const { user } = useAuth()
    const { cartItems } = useCart()
    const [currentStep, setCurrentStep] = useState<CheckoutStep>(user ? 'delivery-pickup' : 'signin');
    const [clientSecret, setClientSecret] = useState<string>('');
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [orderFees, setOrderFees] = useState({serviceFee: 0, subTotal: 0});
    const [customerAddress, setCustomerAddress] = useState<CustomerAddress | null>(null);
    
    useEffect(() => {
        if(user && currentStep === 'signin') {
            handleNextStep();
        }
    }, [user, currentStep]);

    useEffect(() => {
        if (user) {
            form.setValue('customer.signinEmail', user.email || '');
            form.setValue('customer.guestEmail', user.user_metadata?.email || '');
            form.setValue('customer.guestName', 
                `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim()
            );
            form.setValue('customer.phone', user.user_metadata?.phone || '');
        }
    }, [user]);

    useEffect(() => {
        const fetchCustomerAddress = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`/api/customers?customer_id=${user.id}`);
                    const data = await response.json();
                    // Only try to parse if data.address exists and is a string
                    if (data?.address && typeof data.address === 'string') {
                        setCustomerAddress(JSON.parse(data.address));
                    } else {
                        // Set to null or empty object if no address exists
                        setCustomerAddress(null);
                    }
                } catch (error) {
                    console.error('Error fetching customer address:', error);
                    // Set to null or empty object on error
                    setCustomerAddress(null);
                }
            }
        };
    
        fetchCustomerAddress();
    }, [user?.id]);

    const createPaymentIntent = async () => {
        try {
            if (!orderTotal) {
                console.error('No order total available:', orderTotal);
                return;
            }
            const paymentIntentResponse = await fetch('/api/payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(orderTotal * 100)
                })
            });

            const responseText = await paymentIntentResponse.text();


            if (!paymentIntentResponse.ok) {
                console.error('Payment intent creation failed:', responseText);
                return;
            }

            const { clientSecret } = JSON.parse(responseText);
            if (clientSecret) {
                setClientSecret(clientSecret);
            } else {
                console.error('No client secret in response');
            }
        } catch (error) {
            console.error('Error creating payment intent:', error);
        }
    };
    
    const calculateOrderTotal = useCallback(() => {
        if (!cartItems?.length) {
            return;
        }
    
        const subTotal = cartItems.reduce((acc, item) => {
            const itemTotal = item.base_price * item.quantity;
            const modifiersTotal = item.cart_item_modifiers?.reduce((modTotal, mod) => {
                const optionsTotal = mod.cart_item_modifier_options?.reduce((optTotal, opt) => 
                    optTotal + (opt?.modifier_options?.price ?? 0), 0) || 0;
                return modTotal + optionsTotal;
            }, 0) || 0;
            return acc + itemTotal + modifiersTotal;
        }, 0);
        
        const serviceFee = subTotal * 0.1;
        const total = subTotal + serviceFee;

        setOrderTotal(total);
        setOrderFees({ serviceFee, subTotal });
    }, [cartItems]);

    useEffect(() => {
        calculateOrderTotal();
    }, [calculateOrderTotal]);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            customer: {
                signinEmail: user?.email ?? '',
                guestEmail: user?.user_metadata?.email || '',
                guestName: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim(),
                phone: user?.user_metadata?.phone || '',
            },
            delivery: {
                method: 'pickup',
            },
        },
    });
    
    const steps = [
        { id: 'signin', name: 'Customer Info', status: currentStep === 'signin' ? 'current' : 'complete' },
        { id: 'delivery-pickup', name: 'Pickup Date and Time', status: currentStep === 'delivery-pickup' ? 'current' : currentStep === 'summary' ? 'complete' : 'upcoming' },
        { id: 'summary', name: 'Review & Pay', status: currentStep === 'summary' ? 'current' : 'upcoming' }
    ]

    const handleNextStep = () => {
    switch (currentStep) {
        case 'signin': 
            setCurrentStep('delivery-pickup');
            break;
        case 'delivery-pickup':
            if (!orderTotal || orderTotal <= 0) {
                console.log('Cannot proceed - no order total');
                return;
            }
            console.log('Moving to summary with total:', orderTotal);
            setCurrentStep('summary');
            createPaymentIntent();
            break;
    }
};

    // const handlePreviousStep = () => {
    //     switch (currentStep) {
    //         case 'delivery-pickup':
    //             setCurrentStep('signin')
    //             break;
    //         case 'summary':
    //             setCurrentStep('delivery-pickup')
    //             break;
    //         default:
    //             break;
    //     }
    // }

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            
            // Create order payload
            const orderPayload = {
                customer_id: user?.id || null,
                customer: {
                    ...data.customer,
                },
                delivery: data.delivery,
                fees: orderFees,
                total: orderTotal,
                cartItems
            };

            // Create order
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });
            
            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const order = await orderResponse.json();
            return order;
            
        } catch (error) {
            console.error('Error in checkout:', error);
        }
    };


    if (!cartItems || cartItems.length === 0) {
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button variant="default" asChild>
          <Link href="/menu">Continue Shopping</Link>
        </Button>
      </div>
    }


    return (
        <div className="max-w-4xl mx-auto">
            <nav aria-label="Progress" className="mb-12">
                <ol role="list" className="flex items-center justify-center space-x-8">
                {steps.map((step, stepIdx) => (
                    <li key={step.id} className="relative">
                        <div className="flex items-center">
                            <div className={`
                                h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                                ${step.status === 'complete' ? 'bg-red-600 text-white' : 
                                  step.status === 'current' ? 'border-2 border-red-600 text-white' : 
                                  'border-2 border-gray-300 text-gray-300'}
                            `}>
                                {step.status === 'complete' ? '✓' : stepIdx + 1}
                            </div>
                            {stepIdx !== steps.length - 1 && (
                                <div className={`
                                    hidden sm:block h-0.5 w-16
                                    ${step.status === 'complete' ? 'bg-red-600' : 'bg-gray-300'}
                                `} />
                            )}
                        </div>
                        <span className="mt-2 block text-sm font-medium text-center text-gray-200">
                            {step.name}
                        </span>
                    </li>
                ))}
                </ol>
            </nav>
            <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {currentStep === 'signin' && !user && (
                        <CheckoutCustomerSignIn 
                            form={form}
                        onComplete={handleNextStep} 
                    />
                )}

                {currentStep === 'delivery-pickup' && (
                    <DeliveryPickupSelector
                        form={form}
                        onComplete={handleNextStep}
                    />
                )}
              
                {currentStep === 'summary' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <OrderSummary
                                form={form}
                                orderTotal={orderTotal}
                                orderFees={orderFees}
                            />
                        </div>
                        <div>
                            {clientSecret ? (
                                <Elements 
                                    stripe={stripePromise} 
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'night',
                                            variables: {
                                                colorPrimary: '#dc2626',
                                                colorBackground: '#000000',
                                                colorText: '#ffffff',
                                                colorDanger: '#df1b41',
                                                fontFamily: 'system-ui, sans-serif',
                                                spacingUnit: '4px',
                                                borderRadius: '4px',
                                            },
                                        },
                                    }}
                                >
                                    <PaymentSection 
                                            customerAddress={customerAddress}
                                            onSubmit={onSubmit}
                                            form={form}
                                    />
                                </Elements>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </form>
            </Form>
        </div>
    </div>
    )

}

export default CheckoutSteps;

 {/* Navigation buttons
        <div className="flex justify-center space-x-4 mt-8">
            {(currentStep !== 'signin' && currentStep !== 'summary') && (
                <Button 
                    variant="outline"
                    onClick={handlePreviousStep}
                >
                    Back
                </Button>
            )}
            {(currentStep !== 'signin' && currentStep !== 'summary') && (
                <Button 
                    onClick={handleNextStep}
                    className="bg-red-600 text-white"
                >
                    Continue
                </Button>
            )}
        </div> */}