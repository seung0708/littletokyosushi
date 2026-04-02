'use client';

import Link from 'next/link';

import {useState, useEffect} from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./navigation"
import MobileNav from './mobilenav';
import Logo from './ui/nav/logo';
import CartIcon from './ui/nav/cart-icon';

const navLinks = [
    {name: "Menu", href:"/menu"}, 
    {name: "About", href: "/about"},
    {name: "Contact Us", href: "/contact"}
]


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    })


    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-16">
                <Link href="/">
                    <Logo />
                </Link>
                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map(link => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <CartIcon isScrolled={isScrolled} />
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`md:hidden z-60 ${isScrolled ? "text-foreground" : "text-white"}`}
                >
                    {isMobileMenuOpen ? 
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
                        :
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
                    }
                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-full left-0 right-0 border-b border-border bg-background p-6 md:hidden">
                            <div className="flex flex-col gap-4">
                                {navLinks.map(link => (
                                    <Link 
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg font-medium text-foreground"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <CartIcon isScrolled={isScrolled} />
                            </div>
                            
                        </div>
                    )}
                </button>
            </nav>
        </header>
    );
}

//  <header 
//                 className={`
//                     fixed top-0 w-full z-50
//                     px-3 sm:px-4 md:px-6 xl:px-8 
//                     py-2 sm:py-3 lg:py-4
//                     bg-black/90 backdrop-blur-md 
//                     text-white
//                     transition-all duration-300 ease-in-out
//                     ${isScrolled ? 'shadow-2xl bg-black/95' : ''}
//                     ${isScrolled ? 'py-2 sm:py-2.5 lg:py-3' : ''}
//                 `}
//             >
//                 <div className="max-w-7xl mx-auto flex items-center justify-between">
//                     
                    
//                     <div className="flex items-center md:gap-2">
//                         <Navbar />
                        
//                         <button
//                             type="button"
//                             className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-red-400 hover:bg-white/10 active:bg-white/20 transition-all duration-200"
//                             onClick={toggleMenu}
//                             aria-expanded={isOpen}
//                         >
//                         <span className="sr-only">Open main menu</span>
//                        
//                     </button>
//                     <CartIcon />
//                     </div>
//                 </div>
//             </header>

//             <MobileNav toggleMenu={toggleMenu} isOpen={isOpen} />