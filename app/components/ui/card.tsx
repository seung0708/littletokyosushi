import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode; 
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
    description?: string 
}


export const Card: React.FC<CardProps> = ({className, children}) => {
    return <div className={`bg-white shadow-md rounded-lg ${className}`}> {children}</div>
}

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="p-4 border-b">{children}</div>;
  };
  
  export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <h2 className="text-2xl font-bold text-center">{children}</h2>;
  };
  
  export const CardDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <p className="text-center text-gray-600">{children}</p>;
  };
  
  export const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
  };
  
  export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="p-4 border-t">{children}</div>;
  };