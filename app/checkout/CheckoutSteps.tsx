'use client'
import { useState } from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { checkoutSchema, type CheckoutFormValues } from '@/types/checkout'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useCart } from '@/app/context/cartContext'
import { useAuth } from '@/app/context/authContext'
import CheckoutCustomerSignIn from '@/components/auth/checkoutCustomerSignIn'
import DeliveryPickupSelector from '@/components/checkout/deliverypickupselector';  
import OrderSummary from '@/components/checkout/orderSummary';

type CheckoutStep =  'signin' | 'delivery-pickup' | 'summary';

const CheckoutSteps = () => {
    const { user } = useAuth()
    const { cartItems } = useCart()
    const [currentStep, setCurrentStep] = useState<CheckoutStep>(user ? 'delivery-pickup' : 'signin');
    
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
        { id: 'signin', name: 'Sign In', status: currentStep === 'signin' ? 'current' : 'complete' },
        { id: 'delivery-pickup', name: 'Delivery Method', status: currentStep === 'delivery-pickup' ? 'current' : currentStep === 'summary' ? 'complete' : 'upcoming' },
        { id: 'summary', name: 'Review & Pay', status: currentStep === 'summary' ? 'current' : 'upcoming' }
    ]

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

    const onSubmit = async (data: CheckoutFormValues) => {
        console.log('Checkout Form Data:', data);
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-none lg:px-0">
            <nav aria-label="Progress">
                <ol role="list" className="flex items-center">
                    {steps.map((step, stepIdx) => (
                        <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                            <div className="flex items-center">
                                <div className={`
                                  h-8 w-8 rounded-full flex items-center justify-center
                                ${step.status === 'complete' ? 'bg-red-600' : 
                                step.status === 'current' ? 'border-2 border-red-600' : 
                                'border-2 border-gray-300'}
                                `}>
                                  {step.status === 'complete' ? '✓' : stepIdx + 1}
                                </div>
                                {stepIdx !== steps.length - 1 && (
                                <div className={`h-0.5 w-full sm:w-20 ${step.status === 'complete' ? 'bg-red-600' : 'bg-gray-300'}`} />
                                )}
                            </div>
                            <span className="mt-2 block text-sm font-medium">{step.name}</span>
                        </li>
                    ))}
                </ol>
            </nav>

            <div className="mt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {currentStep === 'signin' && (
                      <CheckoutCustomerSignIn 
                        onComplete={() => handleNextStep()} 
                      />
                  )}

                  {currentStep === 'delivery-pickup' && (
                      <DeliveryPickupSelector
                        form={form}
                        onComplete={() => handleNextStep()}
                      />
                  )}

                  {currentStep === 'summary' && (
                    <OrderSummary 
                      form={form}
                      onComplete={() => form.handleSubmit(onSubmit)()}
                    />
                  )}
                </form>
              </Form>
            </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {currentStep !== 'signin' && (
          <button onClick={handlePreviousStep} className="text-sm text-gray-600">
            Back
          </button>
        )}
        {currentStep !== 'summary' && (
          <button 
            onClick={handleNextStep}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Continue
          </button>
        )}
      </div>
    </div>
    )

}

export default CheckoutSteps;