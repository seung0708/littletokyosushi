'use client';

import { useEffect } from 'react';

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log order-specific errors
    console.error('Orders error:', error);
  }, [error]);

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-red-600 mb-4">Order Processing Error</h2>
        <p className="text-gray-600 mb-6">
          There was an error processing the order. This could be due to:
        </p>
        <ul className="list-disc pl-5 mb-6 text-gray-600">
          <li>Temporary system unavailability</li>
          <li>Network connectivity issues</li>
          <li>Invalid order data</li>
        </ul>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => window.location.href = '/orders'}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Orders
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
