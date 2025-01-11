'use client';
import Link from "next/link";
import Svg from "../svg";
import { useCart } from "@/app/context/cartContext";


export default function CartIcon() {
    const { cartItems } = useCart();
    return (
        <div className="ml-4 flow-root lg:ml-6">
            <Link href="/cart" className="relative group -m-2 flex items-center p-2">
                <Svg
                    className="h-6 w-6 flex-shrink-0 text-white-900"          
                >
                    <path
                        strokeLinecap="round"
                            strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                </Svg>
                <span className="absolute top-0.5 -right-0.5 text-sm font-medium text-white bg-red-500 rounded-full h-5 w-5 flex items-center justify-center">{cartItems.length}</span>
                <span className="sr-only">items in cart, view bag</span>
            </Link>
        </div>
    )
}