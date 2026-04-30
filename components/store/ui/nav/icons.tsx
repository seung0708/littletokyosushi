'use client';
import Link from "next/link";
import Svg from "../svg";
import { useCart } from "@/app/context/cartContext";
import { useState, useEffect } from 'react';


export const CartIcon = ({isScrolled}) => {
    const { cartItems } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Link href="/cart" className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-accent text-sm font-semibold text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span className="bg-white text-accent rounded-full w-[18px] h-[18px] text-[11px] font-bold flex items-center justify-center">2</span>
        </Link>

        // <a href="cart.html" class="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-accent text-sm font-semibold text-white transition-colors">
        //   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        //   Cart <span class="bg-white text-accent rounded-full w-[18px] h-[18px] text-[11px] font-bold flex items-center justify-center">2</span>
        // </a>
    )
}


export const HamburgerMenu = () => {
    return (
        <>
           <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </>
    )
}

export const XMenu = () => {
    return (
        <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
    )
}
