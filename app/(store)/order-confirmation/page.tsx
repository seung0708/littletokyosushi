'use client';
import { useEffect, useState } from 'react';
import {useSearchParams} from 'next/navigation'
import { useCart } from '@/app/context/cartContext';
import { format } from 'date-fns';
import {Order, OrderItem, OrderItemModifier, OrderItemModifierOption } from '@/types/order';

// interface PageProps {
//   params: {
//     orderId: string;
//   };
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// }

const Page: React.FC = () => {
  
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // const [error, setError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentId = searchParams.get('payment_intent');
      const paymentIntentSecret = searchParams.get('payment_intent_client_secret');
      const redirectStatus = searchParams.get('redirect_status');

      if(paymentId && paymentIntentSecret && redirectStatus === 'succeeded' && !paymentVerified) {
        try {
          const verifyResponse = await fetch('/api/orders/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentId,
                paymentIntentSecret
            })
          });

          if (!verifyResponse.ok) {
            const errorText = await verifyResponse.text();
            console.error('Verification response:', errorText);
            throw new Error(`Payment verification failed: ${errorText}`);
          }

          const verifyData = await verifyResponse.json();
          
          setOrderId(verifyData.orderId);
          

          if (verifyData.clearCart) {
            console.log('Clearing cart data...');
            clearCart();
          }
          
          setPaymentVerified(true);
        } catch (error) {
          console.error('Error verifying payment:', error);
        }
      } else {
        console.log('Skipping payment verification due to:', {
          missingPaymentId: !paymentId,
          missingSecret: !paymentIntentSecret,
          incorrectStatus: redirectStatus !== 'succeeded',
          alreadyVerified: paymentVerified
        });
      }
    };
    verifyPayment();
  },[searchParams, paymentVerified ,clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
    try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        setOrder(data.orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  },[orderId]);


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Thanks for your Order!</h1>
          <p className="mt-2 text-base text-gray-500">Your order #{order?.short_id} has been successfully placed.</p>

          {/*<dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Tracking number</dt>
            <dd className="mt-2 text-indigo-600">51547878755545848512</dd>
          </dl>*/}
        </div>

        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="sr-only">Pickup information</h3>

          <dl className="grid grid-cols-2 gap-x-6 text-sm">
            <div>
              <dt className="font-medium text-gray-900">Pickup Date</dt>
              <dd className="text-gray-700">
                {order && format(new Date(order.pickup_date), 'EEE, M/d/yy')}
              </dd> 
              <dt className="mt-2 font-medium text-gray-900">Pickup Time</dt>
              <dd className="text-gray-700">
              {order && (
                    <>
                        {order.pickup_time && (
                            (() => {
                                const [hours, minutes] = order.pickup_time.split(':');
                                const date = new Date();
                                date.setHours(parseInt(hours, 10));
                                date.setMinutes(parseInt(minutes, 10));
                                return format(date, 'h:mm a');
                            })()
                        )}
                    </>
                )}
              </dd>
              <dt className="mt-2 font-medium text-gray-900">Pick up Instructions</dt>
              <dd className="mt-2 text-gray-700">
                For new customers, we are located inside of the <strong>Little Tokyo Marketplace</strong> in Downtown Los Angeles. 
                You can find us next to the bakery and poki place.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-md text-gray-900">Store Address</dt>
              <dd className=" text-gray-700">333 S Alameda St, Los Angeles, CA 90013 Ste 100-I</dd>
              <dt className="mt-2 font-medium text-md text-gray-900">Store Phone</dt>
              <dd className="text-gray-700">(213) 617-0343</dd>
            </div>
          </dl>
          {/* <h3 className="sr-only">Your information</h3>

            <h4 className="sr-only">Addresses</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Shipping address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">Kristin Watson</span>
                    <span className="block">7363 Cynthia Pass</span>
                    <span className="block">Toronto, ON N3Y 4H8</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Billing address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">Kristin Watson</span>
                    <span className="block">7363 Cynthia Pass</span>
                    <span className="block">Toronto, ON N3Y 4H8</span>
                  </address>
                </dd>
              </div>
            </dl> */}
        </div>
        
        <div className="mt-10 border-t border-gray-200">
          <h2 className="sr-only">Your order</h2>
          <h3 className="sr-only">Items</h3>
          
          <div className="divide-y divide-gray-200">
          {order?.items.map((item: OrderItem) => (  
            <div key={item.id.substring(0, 8)} className="py-6">
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-900">{item.item_name}<span className="ml-2 text-gray-500">× {item.quantity}</span></h4>
                <p className="text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-gray-500">
                  {item.modifiers.map((modifier: OrderItemModifier) => (
                  <div key={modifier.id?.substring(0, 8)} className="">
                    {modifier.name}:
                    {modifier.options?.map((option: OrderItemModifierOption, index: number) => (
                    <div key={option.id} className="ml-4 mt-1">
                        {index > 0 && '•'}
                        {option.name}
                        {/* {option.quantity > 1 && ` (${option.quantity})`} */}
                        {`+$${(option.price).toFixed(2)}`}
                    </div>
                  ))}
                  </div>
                ))}
                {item.special_instructions && (
                  <div>
                      <p>Special instructions</p>
                      <p>{item.special_instructions}</p>
                  </div>
                )}
                </div>
              )}
              {item.special_instructions && (
                <>
                    
                    
                </>
                )}
            </div>
          ))}
          </div>
          <div className="sm:ml-40 sm:pl-6">
          {/*             
            <h4 className="sr-only">Payment</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Payment method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>Apple Pay</p>
                  <p>Mastercard</p>
                  <p><span aria-hidden="true">••••</span><span className="sr-only">Ending in </span>1545</p>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Shipping method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>DHL</p>
                  <p>Takes up to 3 working days</p>
                </dd>
              </div>
            </dl> */}

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10">
              {/* <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Subtotal</dt>
                <dd className="text-gray-700"></dd>
              </div> */}
              {/* <div className="flex justify-between">
                <dt className="flex font-medium text-gray-900">
                  Discount
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">STUDENT50</span>
                </dt>
                <dd className="text-gray-700">-$18.00 (50%)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Shipping</dt>
                <dd className="text-gray-700">$5.00</dd>
              </div> */}
              <div className="flex flex-col gap-y-4">
                <div className="flex justify-end gap-x-4">
                  <dt className="font-medium text-gray-900">Subtotal</dt>
                  <dd className="text-gray-900">${order?.sub_total.toFixed(2)}</dd>
                </div>
                <div className="flex justify-end gap-x-4">
                  <dt className="font-medium text-gray-900">Service fee</dt>
                  <dd className="text-gray-900">${order?.service_fee.toFixed(2)}</dd>
                </div>
                <div className="flex justify-end gap-x-4">
                  <dt className="font-medium text-gray-900">Total</dt>
                  <dd className="text-gray-900">${order?.total.toFixed(2)}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Page;