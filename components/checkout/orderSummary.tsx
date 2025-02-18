'use client'
import { UseFormReturn } from "react-hook-form";
import { type CheckoutFormValues } from "@/types/checkout";
import { useCart } from "@/app/context/cartContext"; 
import {format} from 'date-fns';

interface Props {
  form: UseFormReturn<CheckoutFormValues>;
  orderTotal: number;
  orderFees: {serviceFee: number, subTotal: number};
}



const OrderSummary = ( {form, orderTotal, orderFees}: Props) => {
    const {cartItems} = useCart();
    const formValues = form.watch();
    const deliveryMethod = formValues.delivery?.method;
    const pickupDate = formValues.delivery?.pickupDate ? new Date(formValues.delivery.pickupDate) : new Date();
    const pickupTime = formValues.delivery?.pickupTime;
    const customer = formValues.customer;
   
    return (
        <>
        <h1 className="sr-only">Checkout</h1>
          <section aria-labelledby="summary-heading" className="py-12 text-white md:px-10 lg:col-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0">
          
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            
              <h2 id="summary-heading" className="text-red-500 text-3xl pb-6">Order summary</h2>
              
              <div>
              <div>
                <h4><span className="text-gray-400">Name:</span> {customer?.guestName}</h4>
                <p><span className="text-gray-400">Email:</span> {customer?.guestEmail || customer?.signinEmail}</p>
                <p><span className="text-gray-400">Fulfillment Method:</span> {deliveryMethod?.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</p>
                <p><span className="text-gray-400">Date:</span> {format(pickupDate, 'EEE MMM dd yyyy')}</p>
                <p><span className="text-gray-400">Time:</span> {pickupTime}</p>
              </div>
              <ul role="list" className="divide-y divide-white divide-opacity-10 text-sm font-medium">                
              {cartItems.map((item) => (
                    <li key={item?.id?.substring(0, 8)} className="flex items-start space-x-4 py-6">  
                            <div className="flex-auto space-y-1">
                                <h3 className="text-lg"><span>{item?.quantity} x </span>{item?.menu_items?.name}</h3>
                                
                                {item?.cart_item_modifiers?.map(modifier => (
                                  <div key={modifier?.id}>
                                    <h4>{modifier.modifiers?.name}</h4>
                                    {modifier?.cart_item_modifier_options?.map(option => (
                                      <div key={option?.id}>
                                        <p className="text-gray-400">{option?.modifier_options?.name} +<span>${option?.modifier_options?.price.toFixed(2)}</span></p>
                                      </div>
                                    ))} 
                                  </div>
                                ))} 
                              {item?.special_instructions && (
                              <div>
                                  <h4>Special Instructions</h4>
                                  <p className="text-gray-400">{item.special_instructions}</p>
                              </div>
                              )}
                            </div>
                
                        <p className="flex-none text-base font-medium">${(item?.quantity * item?.base_price).toFixed(2)}</p>
                    </li>
               ))} 
              </ul>
             
              <dl className="space-y-6 border-t border-red-500 border-opacity-10 pt-6 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd>${orderFees.subTotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Service Fee</dt>
                  <dd>${orderFees.serviceFee.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                  <dt>Total</dt>
                  <dd>
                  ${orderTotal.toFixed(2)}
                  </dd>
                </div>
              </dl>
              </div>
             
            </div>
          
        </section>
        
      </>
    )
}

export default OrderSummary;