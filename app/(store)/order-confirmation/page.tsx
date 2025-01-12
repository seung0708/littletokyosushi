'use client';
import { useEffect, useState } from 'react';
import {useParams, useSearchParams} from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link';

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


const Page: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPaymentAndFetchOrder = async () => {
      const orderId = params.id;
      const paymentId = searchParams.get('payment_intent');
      const paymentIntentSecret = searchParams.get('payment_intent_client_secret');
      const redirectStatus = searchParams.get('redirect_status');
      
      if(!orderId || !paymentId || redirectStatus !== 'succeeded') {
        throw new Error('Invalid order or payment details');
      }
       
      try {
        const response = await fetch(`/api/order-confirmation/${orderId}/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId, paymentIntentSecret }),
        });

        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        const data = await response.json();
        setOrder(data); 
    } catch (error) {
        console.error('Error verifying payment:', error);
    } finally {
        setLoading(false);
    }
  };

  verifyPaymentAndFetchOrder();
  }, [params.id, searchParams]);

    return (
        <div className="bg-white">
  <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
    <div className="max-w-xl">
      <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
      <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">It's on the way!</p>
      <p className="mt-2 text-base text-gray-500">Your order #14034056 has shipped and will be with you soon.</p>

      <dl className="mt-12 text-sm font-medium">
        <dt className="text-gray-900">Tracking number</dt>
        <dd className="mt-2 text-indigo-600">51547878755545848512</dd>
      </dl>
    </div>

    <div className="mt-10 border-t border-gray-200">
      <h2 className="sr-only">Your order</h2>

      <h3 className="sr-only">Items</h3>
      <div className="flex space-x-6 border-b border-gray-200 py-10">
        <img src="https://tailwindui.com/plus/img/ecommerce-images/confirmation-page-05-product-01.jpg" alt="Glass bottle with black plastic pour top and mesh insert." className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40" />
        <div className="flex flex-auto flex-col">
          <div>
            <h4 className="font-medium text-gray-900">
              <a href="#">Cold Brew Bottle</a>
            </h4>
            <p className="mt-2 text-sm text-gray-600">This glass bottle comes with a mesh insert for steeping tea or cold-brewing coffee. Pour from any angle and remove the top for easy cleaning.</p>
          </div>
          <div className="mt-6 flex flex-1 items-end">
            <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
              <div className="flex">
                <dt className="font-medium text-gray-900">Quantity</dt>
                <dd className="ml-2 text-gray-700">1</dd>
              </div>
              <div className="flex pl-4 sm:pl-6">
                <dt className="font-medium text-gray-900">Price</dt>
                <dd className="ml-2 text-gray-700">$32.00</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="sm:ml-40 sm:pl-6">
        <h3 className="sr-only">Your information</h3>

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
        </dl>

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
        </dl>

        <h3 className="sr-only">Summary</h3>

        <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
          <div className="flex justify-between">
            <dt className="font-medium text-gray-900">Subtotal</dt>
            <dd className="text-gray-700">$36.00</dd>
          </div>
          <div className="flex justify-between">
            <dt className="flex font-medium text-gray-900">
              Discount
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">STUDENT50</span>
            </dt>
            <dd className="text-gray-700">-$18.00 (50%)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-900">Shipping</dt>
            <dd className="text-gray-700">$5.00</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-900">Total</dt>
            <dd className="text-gray-900">$23.00</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</div>
    )
}

export default Page;