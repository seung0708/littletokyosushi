'use client'
import { useAuth } from "@/app/context/authContext"

interface CustomerSignInProps {
    onComplete: () => void
}

const CheckoutCustomerSignIn: React.FC<CustomerSignInProps> = ({ onComplete }) => { 
    const { signin } = useAuth()

    const handleSignIn = async () => {
        try {
            // Your sign in logic here
            onComplete()
        } catch (error) {
            console.error('Sign in failed:', error)
        }
    }

    const handleContinueAsGuest = () => {
        onComplete()
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                    Sign in to your account
                </h3>
                <p className="mt-2 text-gray-600">
                    Sign in for a faster checkout experience and to track your orders
                </p>
            </div>

            {/* Sign in form */}
            <div className="space-y-4 mb-8">
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
            </div>

            {/* Buttons */}
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={handleSignIn}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Sign in
                </button>
                <button
                    type="button"
                    className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Sign in with Google
                </button>
            </div>

            {/* Continue as guest */}
            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Continue as guest
                </button>
            </div>
        </div>
    )
}

export default CheckoutCustomerSignIn