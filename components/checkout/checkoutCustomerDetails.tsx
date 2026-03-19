'use client'

import Image from 'next/image';

import {UseFormReturn} from 'react-hook-form'
import {type CheckoutFormValues} from '@/types/checkout'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface CustomerSignInProps {
    form: UseFormReturn<CheckoutFormValues>
    onComplete: () => void
}

const CheckoutCustomerDetails: React.FC<CustomerSignInProps> = ({ form, onComplete }) => { 
 
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black p-6 rounded-lg shadow-md">
                <div className="text-center text-white mb-6">
                    <h2 className="text-xl font-semibold">Checkout</h2>
                    <p className="text-sm">Continue without an account</p>
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="customer.email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" autoComplete="email" {...field} className="text-gray-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customer.name"
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
                    <FormField
                        control={form.control}
                        name="customer.phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your phone number" autoComplete="tel" {...field} className="text-gray-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button onClick={onComplete} className="w-full bg-red-500" variant="default">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CheckoutCustomerDetails