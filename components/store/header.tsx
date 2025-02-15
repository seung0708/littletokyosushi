'use client';
import {useState, useEffect} from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./navigation"
import MobileNav from './mobilenav';
import Logo from './ui/nav/logo';
import CartIcon from './ui/nav/cart-icon';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 20);
            if (currentScrollY > lastScrollY) {
                setIsOpen(false);
            }
            setLastScrollY(currentScrollY);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <header 
                className={`
                    fixed top-0 w-full z-50
                    px-3 sm:px-4 md:px-6 xl:px-8 
                    py-2 sm:py-3 lg:py-4
                    bg-black/90 backdrop-blur-md 
                    text-white
                    transition-all duration-300 ease-in-out
                    ${isScrolled ? 'shadow-2xl bg-black/95' : ''}
                    ${isScrolled ? 'py-2 sm:py-2.5 lg:py-3' : ''}
                `}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Logo />
                    
                    <div className="flex items-center md:gap-2">
                        <Navbar />
                        
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-red-400 hover:bg-white/10 active:bg-white/20 transition-all duration-200"
                            onClick={toggleMenu}
                            aria-expanded={isOpen}
                        >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
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
                        <svg
                            className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
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
                    </button>
                    <CartIcon />
                    </div>
                </div>
            </header>

            <MobileNav toggleMenu={toggleMenu} isOpen={isOpen} />
        </>
    );
}
