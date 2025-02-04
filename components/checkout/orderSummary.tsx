'use client'
import { UseFormReturn } from "react-hook-form";
import { type CheckoutFormValues } from "@/types/checkout";
import { useCart } from "@/app/context/cartContext"; 
import {format} from 'date-fns';
import { useEffect } from 'react';

interface Props {
  form: UseFormReturn<CheckoutFormValues>;
  onTotalCaluated: (total: number, fees: {serviceFee: number, subTotal: number}) => void;
}



const OrderSummary = ( {form, onTotalCaluated}: Props) => {
    const {cartId, cartItems} = useCart();
    const deliveryMethod = form.watch('delivery.method');
    const pickupDate = new Date(form.watch('delivery.pickupDate'));
    const pickupTime = form.watch('delivery.pickupTime');
    const customer = form.watch('customer');
   
    const subTotal = cartItems.reduce((acc, item) => {
        const itemTotal = item.base_price * item.quantity;
        const modifiersTotal = item.cart_item_modifiers?.reduce((modTotal, mod) => {
          const optionsTotal = mod.cart_item_modifier_options?.reduce((optTotal, opt) => optTotal + opt.price, 0) || 0;
          return modTotal + optionsTotal;
        }, 0) || 0;
        return acc + itemTotal + modifiersTotal;
      }, 0) || 0;

    const SERVICE_FEE_PERCENTAGE  = 0.029;
    const SERVICE_FEE_FIXED = 0.30;

    const serviceFee  = (subTotal * SERVICE_FEE_PERCENTAGE) + SERVICE_FEE_FIXED;
    const total = serviceFee + subTotal;

    useEffect(() => {
        onTotalCaluated(total, {serviceFee, subTotal});
    }, [total, subTotal, serviceFee]);

    return (
        <>
        <h1 className="sr-only">Checkout</h1>
          <section aria-labelledby="summary-heading" className="py-12 text-white md:px-10 lg:col-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0">
          {cartItems.map((item) => (
            <div key={item?.id?.substring(0, 8)} className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <h2 id="summary-heading" className="text-red-500 text-3xl pb-6">Order summary</h2>
              <div>
                <h4>{customer?.name}</h4>
                <p>{customer?.email}</p>
                <p>{deliveryMethod}</p>
                <p>{format(pickupDate, 'EEE MMM dd yyyy')}</p>
                <p>{pickupTime}</p>
              </div>
              <ul role="list" className="divide-y divide-white divide-opacity-10 text-sm font-medium">                
                    <li key={item?.id?.substring(0, 8)} className="flex items-start space-x-4 py-6">  
                            <div className="flex-auto space-y-1">
                                <h3><span>{item?.quantity} x </span>{item?.menu_item_name}</h3>
                                
                                {item?.cart_item_modifiers?.map(modifier => (
                                    <>
                                    <p className="font-bold">{modifier?.name}</p>
                                    {modifier?.cart_item_modifier_options?.map(option => (
                                        <>
                                        <p>{option?.name} +<span>${option?.price.toFixed(2)}</span></p>
                                        </>
                                    ))}
                                    </>
                                ))}
                            </div>
                            <div>
                                <h3>Special Instructions</h3>
                                <p>{item.special_instructions}</p>
                            </div>
                        <p className="flex-none text-base font-medium">${(item?.quantity * item?.menu_item_price).toFixed(2)}</p>
                    </li>
                
              </ul>
              <dl className="space-y-6 border-t border-red-500 border-opacity-10 pt-6 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd>${subTotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Service Fee</dt>
                  <dd>${serviceFee.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                  <dt>Total</dt>
                  <dd>
                  ${total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          ))} 
        </section>
        
      </>
    )
}

export default OrderSummary;