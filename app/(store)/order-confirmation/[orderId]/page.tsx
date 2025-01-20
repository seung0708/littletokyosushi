'use client';
import { useEffect, useState, useRef } from 'react';
import {useParams, useSearchParams} from 'next/navigation'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface OrderDetails {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  delivery: {
    method: string;
    pickupDate: string;
    pickupTime: string;
  };
  items: Array<{
    id: string;
    menu_item_name: string;
    quantity: number;
    price: number;
    cart_item_modifiers?: Array<{
      name: string;
      cart_item_modifier_options?: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
  status: string;
  total: number;
  created_at: string;
}

interface PageProps {
  params: {
    orderId: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page: React.FC<PageProps> = ({ params, searchParams: urlSearchParams }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  console.log('order', order);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const verifyPaymentAndFetchOrder = async () => {
      const orderId = params.orderId;
      const paymentId = searchParams.get('payment_intent');
      const paymentIntentSecret = searchParams.get('payment_intent_client_secret');
      const redirectStatus = searchParams.get('redirect_status');
    
      // Only verify payment if we have the required parameters and haven't verified yet
      if(paymentId && paymentIntentSecret && redirectStatus === 'succeeded' && !paymentVerified) {
        console.log('Starting payment verification...');
        try {
          const response = await fetch(`/api/orders/${orderId}/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentId, paymentIntentSecret }),
          });

          console.log('Verification response status:', response.status);
          const responseData = await response.json();

          console.log('Verification response:', responseData);

          if (!response.ok) {
            throw new Error(`Payment verification failed: ${responseData.error || 'Unknown error'}`);
          }

          if (responseData.clearCart) {
            console.log('Clearing cart data...');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartId');
          }
          setPaymentVerified(true);
        } catch (error) {
          console.error('Error verifying payment:', error);
          setError(error instanceof Error ? error.message : 'Payment verification failed');
        }
      } else {
        console.log('Skipping payment verification due to:', {
          missingPaymentId: !paymentId,
          missingSecret: !paymentIntentSecret,
          incorrectStatus: redirectStatus !== 'succeeded',
          alreadyVerified: paymentVerified
        });
      }

      // Always fetch the order
      try {
        console.log('Fetching order details...');
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        console.log('Order data:', data);
        setOrder(data.orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndFetchOrder();
  }, [params.orderId, searchParams, router, paymentVerified]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Thanks for your Order!</h1>
          <p className="mt-2 text-base text-gray-500">Your order #{order?.id?.substring(0, 8).toUpperCase()} has been successfully placed.</p>

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
              <dd className="mt-2 text-gray-700">
                {order && format(new Date(order.pickup_date + 'T00:00:00'), 'LLL EEE d')}
              </dd> 
              <dt className="font-medium text-gray-900">Pickup Time</dt>
              <dd className="mt-2 text-gray-700">
                {order && format(new Date(`${order.pickup_date}T${order.pickup_time}`), 'h:mm a')}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Store Address</dt>
              <dd className="mt-2 text-gray-700">333 S Alameda St, Los Angeles, CA 90013 Ste 100-I</dd>
              <dt className="font-medium text-gray-900">Store Phone</dt>
              <dd className="mt-2 text-gray-700">+1 (555) 555-5555</dd>
              <dt className="font-medium text-gray-900">Store Email</dt>
              <dd className="mt-2 text-gray-700">littletokyosushiinc@gmail.com</dd>
              <dt className="font-medium text-gray-900">Pick up Instructions</dt>
              <dd className="mt-2 text-gray-700">For new customers, we are located inside of the Little Tokyo Marketplace in Downtown Los Angeles. You can find us next to the bakery and poki place.</dd>
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
          <div className="flex space-x-6 border-b border-gray-200 py-10">
          {order?.order_items.map((item: any) => (  
            <div key={item.id.substring(0, 8)} className="">
              <div >
                <h4 className="font-medium text-gray-900">
                  <a href="#">{item.item_name}</a>
                </h4>
                {item.order_item_modifiers?.map((modifier: any) => (
                  <div key={modifier.id.substring(0, 8)} className="mt-1">
                    <p className="text-sm text-gray-500">
                      {modifier.modifier_name}:
                      {modifier.order_item_modifier_options?.map((option: any) => (
                        <span key={option.id} className="ml-1">
                          {option.option_name}
                          {option.quantity > 1 && ` (${option.quantity})`}
                          {option.price > 0 && ` +$${(option.price / 100).toFixed(2)}`}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-1 items-end">
                <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                  <div className="flex">
                    <dt className="font-medium text-gray-900">Quantity</dt>
                    <dd className="ml-2 text-gray-700">{item.quantity}</dd>
                  </div>
                  <div className="flex pl-4 sm:pl-6">
                    <dt className="font-medium text-gray-900">Price</dt>
                    <dd className="ml-2 text-gray-700">{item.price}</dd>
                  </div>
                </dl>
              </div>
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

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
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
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Total</dt>
                <dd className="text-gray-900">${order?.total}</dd>
              </div>
            </dl>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Page;