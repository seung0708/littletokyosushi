import { AuthProvider } from "../context/authContext"
import { CartProvider } from "../context/cartContext"

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
        <AuthProvider>
            <CartProvider>
                <div className="flex items-center justify-center bg-gray-50">
                    {children}
                </div>
            </CartProvider>
        </AuthProvider>
    )
}
