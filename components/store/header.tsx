'use client';

import NavLink from "@/components/store/ui/nav/navLink";
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
        </header>
    );
}
