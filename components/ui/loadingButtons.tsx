'use client';
import { Button } from './button';
import { Loading } from './loading';
import { cn } from '@/utils/utils';
import { forwardRef } from 'react';
import { ButtonHTMLAttributes } from 'react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading: boolean;
    loadingText?: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ 
        children, 
        isLoading, 
        loadingText = 'Loading...', 
        className,
        variant = 'default',
        ...props 
    }, ref) => {
        return (
            <Button
                ref={ref}
                disabled={isLoading}
                variant={variant}
                className={cn(
                    'relative',
                    isLoading && 'cursor-not-allowed',
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <Loading size="sm" variant={variant} />
                        <span>{loadingText}</span>
                    </div>
                ) : (
                    children
                )}
            </Button>
        );
    }
);

LoadingButton.displayName = 'LoadingButton';

export const AddToCartButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ isLoading, loadingText = 'Adding to Cart...', ...props }, ref) => (
        <LoadingButton
            ref={ref}
            isLoading={isLoading}
            loadingText={loadingText}
            variant="default"
            className="w-full"
            {...props}
        />
    )
);

AddToCartButton.displayName = 'AddToCartButton';

export const CheckoutButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ isLoading, loadingText = 'Processing...', children, className, ...props }, ref) => (
        <Button
            ref={ref}
            disabled={isLoading}
            className={className}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                    <Loading size="sm" variant="default" />
                    <span>{loadingText}</span>
                </div>
            ) : (
                children
            )}
        </Button>
    )
);

CheckoutButton.displayName = 'CheckoutButton';