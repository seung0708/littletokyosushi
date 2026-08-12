import { useCart } from "@/app/context/cartContext";
import {ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function ShoppingCart() {
    const { cartItems } = useCart();

    return (
        <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center lg:ml-8">
                <div className="flow-root">
                    <a href="#" className="group -m-2 flex items-center p-2">
                        <ShoppingCartIcon
                            aria-hidden="true"
                            className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                        <span className="sr-only">items in cart, view bag</span>
                    </a>
                </div>
            </div>
        </div>
    )
}