'use client';

import { cn } from "@/utils/utils";

interface LoadingProps {
  variant: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loading({ variant = 'admin', size = 'md', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2',
          sizeClasses[size],
          variant === 'admin' 
            ? 'border-gray-900 border-b-transparent' 
            : 'border-red-600 border-b-transparent'
        )}
      />
    </div>
  );
}
