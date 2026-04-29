'use client';

import {useState, useEffect} from 'react';
import Navbar from "./navigation"
import MobileNav from './mobile-nav';
import Logo from './ui/nav/logo';
import { HamburgerMenu, XMenu } from '@/components/store/ui/nav/icons';

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
        <header id="nav" className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-transparent transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                <Logo />
                <nav className="flex items-center gap-1"> 
                    <Navbar navLinks={navLinks} isScrolled={isScrolled} />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden z-60 ${isScrolled ? "text-foreground" : "text-white"}`}
                    >
                        {isMobileMenuOpen ? 
                            <HamburgerMenu />
                            :
                            <XMenu />
                        }
                        {/* Mobile Menu */}
                        {isMobileMenuOpen && (
                            <MobileNav navLinks={navLinks} />
                        )}
                    </button>
                </nav>
            </div>
        </header>
    );
}
