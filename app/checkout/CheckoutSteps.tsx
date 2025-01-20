'use client'
import PaymentForm from '@/components/checkout/paymentForm'
import {Elements, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { checkoutSchema, type CheckoutFormValues } from '@/types/checkout'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useCart } from '@/app/context/cartContext'
import { useAuth } from '@/app/context/authContext'
import CheckoutCustomerSignIn from '@/components/checkout/checkoutCustomerSignIn'
import DeliveryPickupSelector from '@/components/checkout/deliverypickupselector';  
import OrderSummary from '@/components/checkout/orderSummary';

type CheckoutStep =  'signin' | 'delivery-pickup' | 'summary';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutSteps = () => {
    const { user } = useAuth()
    const { cartItems } = useCart()
    const [currentStep, setCurrentStep] = useState<CheckoutStep>(user ? 'delivery-pickup' : 'signin');
    const [clientSecret, setClientSecret] = useState<string>('');
    const [orderData, setOrderData] = useState<any>(null);
    const [orderTotal, setOrderTotal] = useState<number>(0);

    useEffect(() => {
        if(user && currentStep === 'signin') {
            handleNextStep();
        }
    }, [user, currentStep]);

    useEffect(() => {
        if (user) {
            form.setValue('customer.email', user.user_metadata?.email || user.email || '');
            form.setValue('customer.name', 
                `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim()
            );
            form.setValue('customer.phone', user.user_metadata?.phone || '');
        }
    }, [user]);

     // Create payment intent when total changes
     useEffect(() => {
        const createPaymentIntent = async () => {
            if (orderTotal > 0) {
                try {
                    const paymentIntentResponse = await fetch('/api/payment-intent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            amount: Math.round(orderTotal * 100),
                        }),
                    });

                    if (!paymentIntentResponse.ok) {
                        throw new Error('Failed to create payment intent');
                    }

                    const { clientSecret } = await paymentIntentResponse.json();
                    setClientSecret(clientSecret);
                } catch (error) {
                    console.error('Error creating payment intent:', error);
                }
            }
        };

        createPaymentIntent();
    }, [orderTotal]);

    const updateClientSecret = (secret: string) => {
        setClientSecret(secret);
    };

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
          customer: {
            email: user?.email ?? '',
            name: user?.name ?? '',
            phone: user?.phone ?? '',
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

    const onSubmit = async (data: CheckoutFormValues) => {
        console.log('onSubmit started', data);
        try {
         
            // Then create payment intent
            const paymentIntentResponse = await fetch('/api/payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(orderData.total * 100),
                }),
            });
    
            if (!paymentIntentResponse.ok) {
                throw new Error('Failed to create payment intent');
            }
    
            const { clientSecret } = await paymentIntentResponse.json();
            updateClientSecret(clientSecret);
    
        } catch (error) {
            console.error('Error in checkout:', error);
        }
    };

    const handleNextStep = () => {
        switch (currentStep) {
            case 'signin': 
                setCurrentStep('delivery-pickup')
                break;
            case 'delivery-pickup':
                setCurrentStep('summary')
                break;
            default:
                break;
        }
    }

    const handlePreviousStep = () => {
        switch (currentStep) {
            case 'delivery-pickup':
                setCurrentStep('signin')
                break;
            case 'summary':
                setCurrentStep('delivery-pickup')
                break;
            default:
                break;
        }
    }

    if (!cartItems || cartItems.length === 0) {
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button variant="default" asChild>
          <Link href="/menu">Continue Shopping</Link>
        </Button>
      </div>
    }


    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 sm:py-24">
        <nav aria-label="Progress" className="mb-12">
            <ol role="list" className="flex items-center justify-center space-x-8">
                {steps.map((step, stepIdx) => (
                    <li key={step.id} className="relative">
                        <div className="flex items-center">
                            <div className={`
                                h-8 w-8 rounded-full flex items-center justify-center
                                ${step.status === 'complete' ? 'bg-red-600 text-white' : 
                                  step.status === 'current' ? 'border-2 border-red-600' : 
                                  'border-2 border-gray-300'}
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
                        <span className="mt-2 block text-sm font-medium text-center">
                            {step.name}
                        </span>
                    </li>
                ))}
            </ol>
        </nav>

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
                {currentStep === 'summary' &&  (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <OrderSummary
                        form={form}
                        onTotalCaluated={setOrderTotal}
                    />
                    {clientSecret && (
                        <Elements 
                            stripe={stripePromise} 
                            options={{ 
                                clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                },
                                loader: 'auto',
                             }}
                        >
                            <PaymentForm 
                             formData={form.watch()}
                             total={orderTotal}
                             cartItems={cartItems}
                            />
                        </Elements>
                    )}
                    </div>
                )}

            </form>
        </Form>

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
    </div>
    )

}

export default CheckoutSteps;