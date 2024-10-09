import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode; 
}

export const Button: React.FC<ButtonProps> = ({children, className, ...props}) => {
    return (
        <button 
        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md ${className}`} 
        {...props}>
            {children}
        </button>
    )
}