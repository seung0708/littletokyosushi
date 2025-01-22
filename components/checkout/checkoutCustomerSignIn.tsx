'use client'
import {UseFormReturn} from 'react-hook-form'
import {type CheckoutFormValues} from '@/types/checkout'
import { useAuth } from "@/app/context/authContext"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useCart } from '@/app/context/cartContext';
import { useEffect, useState } from 'react';

interface CustomerSignInProps {
    form: UseFormReturn<CheckoutFormValues>
    onComplete: () => void
}

const CheckoutCustomerSignIn: React.FC<CustomerSignInProps> = ({ form, onComplete }) => { 
    const { user, signup, googleSignin, signin, signinAnonymously } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const { updateCartCustomerId } = useCart()
    const [signInError, setSignInError] = useState<string>('')
    const [signUpError, setSignUpError] = useState<string>('')
    const [guestError, setGuestError] = useState<string>('')

    
    useEffect(() => {
        setSignInError('')
        setSignUpError('')
    }, [isSignUp])

    const handleSignIn = async () => {
        const { customer } = form.getValues()
        try {
            setSignInError('')
            const data = await signin(customer.signinEmail, customer.password)
            console.log('Sign in data:', data)
            if (data?.id) {
                await updateCartCustomerId(data?.id)
                onComplete()
            } else {
                setSignInError(data.error);
            }
            
        } catch (error) {
            console.error('Sign in failed:', error)
            setSignInError('Sign in failed')
        }
    }

    const handleSignUp = async () => {  // Add signup handler
        const { customer } = form.getValues()
        try {
            setSignUpError('')
            const data = await signup(customer.signinEmail, customer.password)
            console.log('Sign up data:', data?.user)
            if (data?.user) {
                await updateCartCustomerId(data?.user?.id)
                onComplete()
            } else {
                setSignUpError(data?.error)
            }
            
        } catch (error) {
            console.error('Sign up failed:', error)
        }
    }

    const handleGoogleSignIn = async () => {  // Add Google handler
        try {
            await googleSignin()
            
        } catch (error) {
            console.error('Google sign in failed:', error)
        } finally {
            onComplete()
        }
    }
 
    const handleContinueAsGuest = async() => {
        const { customer } = form.getValues()
        try {
            setGuestError('')
            const data = await signinAnonymously(customer.guestEmail, customer.guestName)
            console.log('New user:', data)
            if (data?.error) {
                setGuestError(data.error)
            } else {
                await updateCartCustomerId(data?.user?.id)
                onComplete()
            }
            
        } catch (error) {
            setGuestError('Sign in failed')
            console.error('Sign in failed:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isSignUp ? 'Create an account' : 'Sign in to your account'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {isSignUp ? 'Create an account for a faster checkout experience' : 'For a faster checkout experience'}
                    </p>
                </div>

                {/* Email field */}
                <FormField
                    control={form.control}
                    name="customer.signinEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" placeholder="Enter your email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password field */}
                <FormField
                    control={form.control}
                    name="customer.password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" placeholder="Enter your password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Sign in/up button */}
                <button
                    type="button"
                    onClick={isSignUp ? handleSignUp : handleSignIn}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    {isSignUp ? 'Sign up' : 'Sign in'}
                </button>

                {/* Toggle link */}
                <div className="text-center">
                    <button 
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-blue-600 hover:text-red-500"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
                    </button>
                </div>

                {/* Only show Google sign in for sign in view */}
                {!isSignUp && (
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            {/* ... Google SVG ... */}
                        </svg>
                        Sign in with Google
                    </button>
                )}
                {!isSignUp && signInError && <p className="text-red-500">{signInError}</p>}
                {isSignUp && signUpError && <p className="text-red-500">{signUpError}</p>}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue as guest</span>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="customer.guestName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter your name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customer.guestEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter your email" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                  
                <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                    Continue as Guest
                </button>
                {guestError && <p className="text-red-500">{guestError}</p>}  
            </div>
        </div>
    )
}

export default CheckoutCustomerSignIn