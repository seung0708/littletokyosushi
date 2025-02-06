'use client'
import { AuthProvider } from "../context/authContext"
import { CartProvider } from "../context/cartContext"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            {children}
        </div>
    )
}
