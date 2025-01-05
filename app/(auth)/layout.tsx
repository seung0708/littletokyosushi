'use client'
import { AuthProvider } from "../context/authContext"
import { CartProvider } from "../context/cartContext"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-center bg-gray-50">
            {children}
        </div>
    )
}
