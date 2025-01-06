'use client'
import { useState } from 'react'
import { useAuth } from '@/app/context/authContext'
import CheckoutCustomerSignIn from '@/components/auth/checkoutCustomerSignIn'


type CheckoutStepsProps =  'signin' | 'delivery-pickup' | 'summary';

const CheckoutSteps = () => {
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState<CheckoutStepsProps>(user ? 'delivery-pickup' : 'signin');
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
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

    return (
        <div className="space-y-4">
             <div className="space-y-8">
      {/* Progress Steps */}
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
                  <div className={`
                    h-0.5 w-full sm:w-20
                    ${step.status === 'complete' ? 'bg-red-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
              <span className="mt-2 block text-sm font-medium">{step.name}</span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content based on current step */}
      <div className="mt-8">
        {currentStep === 'signin' && (
          <CheckoutCustomerSignIn 
            onComplete={() => handleNextStep()} 
          />
        )}

        {currentStep === 'delivery-pickup' && (
          <DeliveryPickupSelector
            selectedMethod={deliveryMethod}
            onMethodSelect={setDeliveryMethod}
            onComplete={() => handleNextStep()}
          />
        )}

        {currentStep === 'summary' && (
          <OrderSummary 
            deliveryMethod={deliveryMethod}
            onBack={() => handlePreviousStep()}
            onComplete={() => {/* Handle order completion */}}
          />
        )}
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

        </div>
    )

}

export default CheckoutSteps;