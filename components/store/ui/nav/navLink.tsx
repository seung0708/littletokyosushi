'use client';
import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
    href: string;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    showSpan?: boolean;
}

export default function NavLink({ href, children, onClick, className = "", showSpan = false }: NavLinkProps) {

    return (
        <Link href={href} className={className} onClick={onClick}>
            {children}
            {showSpan && (
                <span className='absolute left-0 -bottom-1 w-full h-0.5 bg-red-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100'></span>
            )}
        </Link>
    )
}