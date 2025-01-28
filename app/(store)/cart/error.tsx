'use client';

import { useEffect } from 'react';

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Cart error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-red-600 mb-4">Cart Error</h2>
        <p className="text-gray-600 mb-6">
          We encountered an error with your shopping cart. This might be because:
        </p>
        <ul className="list-disc pl-5 mb-6 text-gray-600">
          <li>Some items are no longer available</li>
          <li>There was a problem with the price calculation</li>
          <li>The session has expired</li>
        </ul>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => window.location.href = '/menu'}
            className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
          >
            Back to Menu
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
