import React from 'react'
// Add this to break layout inheritance
export const metadata = {
    layout: 'login'
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {children}
        </div>
    )
}
