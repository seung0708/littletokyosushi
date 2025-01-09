'use client'
import { UseFormReturn } from "react-hook-form";
import { type CheckoutFormValues } from "@/types/checkout";
import { useCart } from "@/app/context/cartContext"; 
import { Button } from "../ui/button";
import {format} from 'date-fns';

interface Props {
  form: UseFormReturn<CheckoutFormValues>;
  onComplete: () => void;
}

export const OrderSummary = ( {form, onComplete}: Props) => {
    const {cartId, cartItems} = useCart();
    const deliveryMethod = form.watch('delivery.method');
    const pickupDate = new Date(form.watch('delivery.pickupDate'));
    const pickupTime = form.watch('delivery.pickupTime');
    const customer = form.watch('customer');
    console.log(cartItems, customer, deliveryMethod, pickupDate, pickupTime);
    return (
        <>
        <h1 className="sr-only">Checkout</h1>
          <section aria-labelledby="summary-heading" className="bg-red-500 py-12 text-red-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0">
          {cartItems.map((item) => (
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <h2 id="summary-heading" className="text-white text-2xl">Order summary</h2>
              <div>
                <h4>{customer?.name}</h4>
                <p>{customer?.email}</p>
                <p>{deliveryMethod}</p>
                <p>{format(pickupDate, 'EEE MMM dd yyyy')}</p>
                <p>{pickupTime}</p>
              </div>
              <ul role="list" className="divide-y divide-white divide-opacity-10 text-sm font-medium">                
                    <li key={item?.id?.substring(0, 8)} className="flex items-start space-x-4 py-6">
                        <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item?.menu_item_image}`} alt="Front of zip tote bag with white canvas, white handles, and black drawstring top." className="h-20 w-20 flex-none rounded-md object-cover object-center" />
                        
                            <div className="flex-auto space-y-1">
                                <h3 className="text-white">{item?.menu_item_name}</h3>
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
                                <h3 className="text-white">Special Instructions</h3>
                                <p>{item.special_instructions}</p>
                            </div>
                        <p className="flex-none text-base font-medium text-white">${item?.menu_item_price?.toFixed(2)}</p>
                    </li>
                
              </ul>
              <dl className="space-y-6 border-t border-white border-opacity-10 pt-6 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd>
                  ${
                    (
                        item.base_price * item.quantity + 
                        (item.cart_item_modifiers?.reduce((total: number, modifier: any) => {
                            const modifierTotal = modifier.cart_item_modifier_options?.reduce(
                                (subTotal: number, option: any) => subTotal + (option.price || 0), 0) || 0; 
                                return total + modifierTotal;
                            }, 0) || 0
                    ) 
                    ).toFixed(2)
                  }
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Taxes & Fees</dt>
                  <dd>$0</dd>
                </div>
                <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                  ${
                    (
                        item.base_price * item.quantity + 
                        (item.cart_item_modifiers?.reduce((total: number, modifier: any) => {
                            const modifierTotal = modifier.cart_item_modifier_options?.reduce(
                                (subTotal: number, option: any) => subTotal + (option.price || 0), 0) || 0; 
                                return total + modifierTotal;
                            }, 0) || 0
                    ) 
                    ).toFixed(2)
                  } + Taxes and fees
                  </dd>
                </div>
              </dl>
            </div>
          ))} 
        </section>
        <Button
                onClick={onComplete}
                className="w-full bg-red-600 text-white"
            >
                Place Order
            </Button>
      </>
    )
}

export default OrderSummary