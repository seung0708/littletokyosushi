'use client'

import Link from "next/link"
import { useParams } from "next/navigation"

const links = [
    {name: 'Home', href: '/'}, 
    {name: 'About', href: '/#about'},
    {name: 'Contact', href: '/#contact'},
    {name: 'Menu', href: '/menu'}
]

export default function NavLinks() {
    const pathName = useParams();

    return (
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-14 text-white text-lg">
        {links.map(link => {
            return (
                <Link
                    key={link.name}
                    href={link.href}
                    className="relative inline-block group"
                >
                    {link.name}
                    <span className='absolute left-0 -bottom-1 w-full h-0.5 bg-red-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100'></span>
                </Link>
            )
        })}
        <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span>
        </div>
    )
}