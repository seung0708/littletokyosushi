'use client';

import { useEffect } from 'react';

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Store application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but we encountered an error while processing your request. Please try again or contact support if the problem persists.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
          >
            Go to Menu
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
