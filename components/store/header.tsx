'use client';

import NavLink from "@/components/store/ui/nav/navLink";

import {useState, useEffect} from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./navigation"
import MobileNav from './mobile-nav';
import Logo from './ui/nav/logo';

const navLinks = [
    {name: "Menu", href:"/menu"}, 
    {name: "About", href: "/about"},
    {name: "Contact Us", href: "/contact"}
]


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    })


    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md border-border" : "bg-transparent"}`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-16">
                <NavLink href="/">
                    <Logo />
                </NavLink>
                <Navbar navLinks={navLinks} isScrolled={isScrolled} />
            
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
                        <MobileNav navLinks={navLinks} />
                    )}
                </button>
            </nav>
        </header>
    );
}
