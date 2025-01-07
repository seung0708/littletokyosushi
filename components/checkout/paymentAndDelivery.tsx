'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/authContext';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CheckoutFormData {
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    name: string;
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
    deliveryMethod: string;
    deliveryDate: string;
    deliveryTime: string;
    deliveryInstructions: string;
    paymentMethod: string;
};

const formSchema = z.object({
    email: z.string().email(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phone: z.string(),
    name: z.string(),
    cardNumber: z.string(),
    expirationDate: z.string(),
    securityCode: z.string(),
    deliveryMethod: z.string(),
    deliveryDate: z.string(),
    deliveryTime: z.string(),
    deliveryInstructions: z.string(),
    paymentMethod: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const PaymentAndDelivery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDelivery, setIsDelivery] = useState(false);
    const { user } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user?.email ?? '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            phone: '',
            name: '',
            cardNumber: '',
            expirationDate: '',
            securityCode: '',
            deliveryMethod: '',
            deliveryDate: '',
            deliveryTime: '',
            deliveryInstructions: '',
            paymentMethod: '',
        },
    });


    return (
        <>
            <h2 id="payment-and-shipping-heading" className="sr-only">Payment and shipping details</h2>
            <Form {...form}>
                <form>
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                    <div>
                        <h3 id="contact-info-heading" className="text-lg font-medium text-gray-900">Contact information</h3>
                        <div className="mt-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">Email address</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mt-10">
                        <h3 className="text-lg font-medium text-gray-900">Payment details</h3>
                        <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                        <div className="col-span-3 sm:col-span-4">
                            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</label>
                            <div className="mt-1">
                            <input type="text" id="card-number" name="card-number" autoComplete="cc-number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                        <div className="col-span-2 sm:col-span-3">
                            <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                            <div className="mt-1">
                            <input type="text" name="expiration-date" id="expiration-date" autoComplete="cc-exp" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                            <div className="mt-1">
                            <input type="text" name="cvc" id="cvc" autoComplete="csc" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                        </div>
                    </div>
                        <div className="mt-10">
                        <h3 className="text-lg font-medium text-gray-900">Billing information</h3>
                        <div className="mt-6 flex items-center">
                            <input id="same-as-shipping" name="same-as-shipping" type="checkbox" checked className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <div className="ml-2">
                            <label htmlFor="same-as-shipping" className="text-sm font-medium text-gray-900">Same as shipping information</label>
                            </div>
                        </div>
                        </div>
                        <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                        <button type="submit" className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Pay now</button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default PaymentAndDelivery;