'use client'
import {UseFormReturn} from 'react-hook-form'
import {type CheckoutFormValues} from '@/types/checkout'
import { useAuth } from "@/app/context/authContext"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useCart } from '@/app/context/cartContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        <div className="grid md:grid-cols-2 gap-8">
            {/* Returning Customer Column */}
            <div className="bg-black text-white p-6 rounded-lg">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Returning Customer</h2>
                    <p className="text-sm">Sign in to your account</p>
                </div>

                <div className="space-y-4">
                    {!isSignUp ? (
                        <>
                            <FormField
                                control={form.control}
                                name="customer.signinEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" autoComplete="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="customer.password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" autoComplete="current-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {signInError && <p className="text-red-500 text-sm">{signInError}</p>}
                            <div className="space-y-4">
                                <Button onClick={handleSignIn} className="w-full bg-red-500" variant="default">
                                    Sign In
                                </Button>
                                <Button onClick={handleGoogleSignIn} className="w-full bg-red-500" variant="default">
                                    <Image src="/assets/images/google.svg" alt="Google Logo" width={20} height={20} className="inline-block mr-2" />
                                    Continue with Google
                                </Button>
                                <p className="text-sm text-center">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(true)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <FormField
                                control={form.control}
                                name="customer.signinEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" autoComplete="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="customer.password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Create a password" autoComplete="current-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {signUpError && <p className="text-red-500 text-sm">{signUpError}</p>}
                            <div className="space-y-4">
                                <Button onClick={handleSignUp} className="w-full" variant="default">
                                    Create Account
                                </Button>
                                <p className="text-sm text-center">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(false)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Guest Checkout Column */}
            <div className="bg-black p-6 rounded-lg shadow-md">
                <div className="text-center text-white mb-6">
                    <h2 className="text-xl font-semibold">Guest Checkout</h2>
                    <p className="text-sm">Continue without an account</p>
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="customer.guestEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" autoComplete="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customer.guestName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your name" autoComplete="name" {...field} className="text-gray-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {guestError && <p className="text-red-500 text-sm">{guestError}</p>}
                    <Button onClick={handleContinueAsGuest} className="w-full bg-red-500" variant="default">
                        Continue as Guest
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CheckoutCustomerSignIn