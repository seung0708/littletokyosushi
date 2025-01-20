'use client'
import {UseFormReturn} from 'react-hook-form'
import {type CheckoutFormValues} from '@/types/checkout'
import { useAuth } from "@/app/context/authContext"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';

interface CustomerSignInProps {
    form: UseFormReturn<CheckoutFormValues>
    onComplete: () => void
}

const CheckoutCustomerSignIn: React.FC<CustomerSignInProps> = ({ form, onComplete }) => { 
    const {user,signin, googleSignin, signinAnonymously } = useAuth()

    const handleSignIn = async () => {
        try {
            // Your sign in logic here
            onComplete()
        } catch (error) {
            console.error('Sign in failed:', error)
        }
    }
 
    const handleContinueAsGuest = async () => {
        const { customer } = form.getValues()
        try {
            await signinAnonymously(customer.email, customer.name)
        } catch (error) {
            console.error('Sign in failed:', error)
        } finally {
            onComplete()
        }
    }

    return (
        <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sign In Section */}
                <div className="p-6 border rounded-lg shadow-sm space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold">Sign In</h4>
                        <p className="text-sm text-gray-500">
                            Sign in for a faster checkout experience
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => signin}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Sign in
                    </button>

                    <button
                        type="button"
                        onClick={() => googleSignin}
                        className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Sign in with Google
                    </button>
                </div>

                {/* Guest Section */}
                <div className="p-6 border rounded-lg shadow-sm space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold">Continue as Guest</h4>
                        <p className="text-sm text-gray-500">
                            Please input your name and email to receive order updates
                        </p>
                    </div>

                    <FormField
                        control={form.control}
                        name="customer.name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="customer.email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* <FormField
                        control={form.control}
                        name="customer.phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Phone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    <Button
                        type="button"
                        onClick={handleContinueAsGuest}
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Continue as guest
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CheckoutCustomerSignIn