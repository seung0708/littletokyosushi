'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/app/context/cartContext';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { retryWithBackoff } from '@/lib/utils/api-retry';

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { clearCart } = useCart();
  
  // Check URL for order ID or handle payment verification
  useEffect(() => {
    const urlOrderId = searchParams.get('id');
    if (urlOrderId) {
      setOrderId(urlOrderId);
      fetchOrder(urlOrderId);
    } else {
      verifyPayment();
    }
  }, [searchParams]);

  const verifyPayment = async () => {
    const paymentId = searchParams.get('payment_intent');
    const paymentIntentSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if(paymentId && paymentIntentSecret && redirectStatus === 'succeeded' && !paymentVerified) {
      try {
        await retryWithBackoff(async () => {
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
          console.log(verifyData);
          setOrderId(verifyData.orderId);

          if (verifyData.clearCart) clearCart();

          setPaymentVerified(true);
          router.replace(`/order-confirmation?id=${verifyData.orderId}`);
        });
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    }
  };

  const fetchOrder = async (id: string) => {
    try {
      await retryWithBackoff(async () => {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data.orderData);
      });
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-400 pt-24">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="mt-2 text-4xl text-white font-bold tracking-tight sm:text-5xl">Thanks for your Order!</h1>
          <p className="mt-2 text-base">Your order #<span className="text-white">{order?.short_id?.toUpperCase()}</span> has been successfully placed.</p>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <dl className="grid grid-cols-2 gap-x-6 text-sm">
            <div>
              <dt className="text-lg">Pickup Date</dt>
              <dd className="text-white">
                {order && format(new Date(order.pickup_date), 'EEE, M/d/yy')}
              </dd> 
              <dt className="mt-2 text-lg">Pickup Time</dt>
              <dd className="text-white">
                {order && (
                  <>
                    {order.pickup_time && (
                      format(new Date(`2000-01-01T${order.pickup_time}`), 'h:mm a')
                    )}
                  </>
                )}
              </dd>
              <dt className="mt-2 font-medium text-lg">Pick up Instructions</dt>
              <dd className="mt-2 text-gray-200">
                For new customers, we are located inside of the <strong>Little Tokyo Marketplace</strong> in Downtown Los Angeles. 
                You can find us next to the bakery and poki place.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-lg">Store Address</dt>
              <dd className="text-white">333 S Alameda St, Los Angeles, CA 90013 Ste 100-I</dd>
              <dt className="mt-2 font-medium text-lg">Store Phone</dt>
              <dd className="text-white">(213) 617-0343</dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <h2 className="my-5 text-3xl font-bold text-white">Order Details</h2>
          {order?.order_items.map((item) => (  
            <div key={item.id.substring(0, 8)} className="py-6">
              <div className="flex justify-between">
                <h4 className="font-medium text-white text-lg">{item.item_name}<span className="ml-2 text-gray-500">× {item.quantity}</span></h4>
                <p className="text-white">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
              {item.order_item_modifiers && item.order_item_modifiers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-4 text-sm">
                  {item.order_item_modifiers.map((modifier) => (
                    <div key={modifier.id?.substring(0, 8)} className="">
                      {modifier.modifier_name}:
                      {modifier.order_item_modifier_options?.map((option) => (
                        <div key={option.id?.substring(0, 8)} className="ml-2">
                          {option.option_name} +${option.option_price.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm">
            <div className="flex flex-col gap-y-4">
              <div className="flex justify-end gap-x-4">
                <dt className="text-lg">Subtotal</dt>
                <dd className="text-white">${order?.sub_total.toFixed(2)}</dd>
              </div>
              <div className="flex justify-end gap-x-4">
                <dt className="text-lg">Service fee</dt>
                <dd className="text-white">${order?.service_fee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-end gap-x-4">
                <dt className="text-lg">Total</dt>
                <dd className="text-white">${order?.total.toFixed(2)}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Page;