import { render, renderHook } from '@testing-library/react'
import CheckoutCustomerSignIn from '@/components/checkout/checkoutCustomerDetails'
import { AuthProvider } from '@/app/context/authContext';
import {CartProvider} from '@/app/context/cartContext'
import {ToastProvider} from '@/app/context/toastContext';

import {useForm} from 'react-hook-form';
import { CheckoutFormValues } from '@/types/checkout';


describe('Does the component render', () => {
    it('should render the component', () => {
        const {result} = renderHook(() => useForm<CheckoutFormValues>())
        const mockOnComplete = jest.fn();
        // const mockForm = {
        //     getValues: jest.fn(),
        //     control: control
        // } as any;
        // TODO: Add what we need here
        render(
            <ToastProvider>
            <AuthProvider>
                <CartProvider>
                    <CheckoutCustomerSignIn 
                        form={result.current}
                        onComplete={mockOnComplete}
                    />
                </CartProvider>
            </AuthProvider>
            </ToastProvider>                
        )
    })
})
