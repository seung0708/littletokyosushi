'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/cartContext'
import CheckoutSteps from "./CheckoutSteps"

const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const { cartItems, isCartLoading } = useCart()
  
  useEffect(() => {
    if (!isCartLoading) {
      const completedOrderId = localStorage.getItem('lastCompletedOrder')
      if (completedOrderId) {
        router.replace(`/order-confirmation?id=${completedOrderId}`)
        return
      }
    }
  }, [cartItems, isCartLoading, router])

  // Show loading state while cart is loading
  if (isCartLoading) {
    return <div className="min-h-screen bg-black text-white">
      <div className="w-full bg-black pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    </div>
  }

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