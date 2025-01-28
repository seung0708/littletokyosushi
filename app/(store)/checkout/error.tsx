'use client';

import { useEffect } from 'react';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Checkout error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-red-600 mb-4">Checkout Error</h2>
        <p className="text-gray-600 mb-6">
          We encountered an error during checkout. This might be because:
        </p>
        <ul className="list-disc pl-5 mb-6 text-gray-600">
          <li>There was a problem processing your payment</li>
          <li>The order couldn't be created</li>
          <li>Some items in your cart are no longer available</li>
        </ul>
        <p className="text-sm text-gray-500 mb-6">
          Don't worry - if any payment was processed, it will be automatically refunded.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => window.location.href = '/cart'}
            className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
          >
            Back to Cart
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
