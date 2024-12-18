import { AuthProvider } from "../(main)/context/authContext"
import { CartProvider } from "../(main)/context/cartContext"

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
