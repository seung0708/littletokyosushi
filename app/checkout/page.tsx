'use client'

import CheckoutSteps from "./CheckoutSteps"

const CheckoutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full bg-black pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Checkout</h1>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-300">Complete your order</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CheckoutSteps />
      </div>
    </div>
  )
}

export default CheckoutPage