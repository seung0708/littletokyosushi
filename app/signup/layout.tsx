import { AuthProvider } from "@/app/context/authContext"
import { CartProvider } from "@/app/context/cartContext"

// Add this to break layout inheritance
export const metadata = {
    layout: 'login'
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CartProvider>
            <AuthProvider>
                <div className="flex items-center justify-center bg-gray-50">
                    {children}
                </div>
            </AuthProvider>
        </CartProvider>
    )
}
