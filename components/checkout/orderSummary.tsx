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
    console.log(cartItems);
    const deliveryMethod = form.watch('delivery.method');
    const pickupDate = new Date(form.watch('delivery.pickupDate') as string);
    const pickupTime = form.watch('delivery.pickupTime');
    const customer = form.watch('customer');
   
    return (
        <>
        <h1 className="sr-only">Checkout</h1>
          <section aria-labelledby="summary-heading" className="py-12 text-white md:px-10 lg:col-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0">
          
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            
              <h2 id="summary-heading" className="text-red-500 text-3xl pb-6">Order summary</h2>
              
              <div>
              <div>
                <h4>{customer?.guestName}</h4>
                <p>{customer?.guestEmail || customer?.signinEmail}</p>
                <p>{deliveryMethod}</p>
                <p>{format(pickupDate, 'EEE MMM dd yyyy')}</p>
                <p>{pickupTime}</p>
              </div>
              {cartItems.map((item) => (
              <ul role="list" className="divide-y divide-white divide-opacity-10 text-sm font-medium">                
                    <li key={item?.id?.substring(0, 8)} className="flex items-start space-x-4 py-6">  
                            <div className="flex-auto space-y-1">
                                <h3><span>{item?.quantity} x </span>{item?.menu_items?.name}</h3>
                                
                                {item?.cart_item_modifiers?.map(modifier => (
                                    <div key={modifier?.id}>
                                    <p className="font-bold">{modifier.modifier?.name}</p>
                                    {modifier?.cart_item_modifier_options?.map(option => (
                                        <>
                                        <p>{option?.modifier_options?.name} +<span>${option?.modifier_options?.price.toFixed(2)}</span></p>
                                        </>
                                    ))}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3>Special Instructions</h3>
                                <p>{item.special_instructions}</p>
                            </div>
                        <p className="flex-none text-base font-medium">${(item?.quantity * item?.base_price).toFixed(2)}</p>
                    </li>
              
              </ul>
              ))} 
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