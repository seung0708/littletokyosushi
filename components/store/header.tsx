'use client';
import {useState, useEffect} from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./navigation"
import MobileNav from './mobilenav';
import Logo from './ui/nav/logo';

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
                    fixed w-full z-50
                    px-4 sm:px-6 lg:px-8 
                    py-3 sm:py-4
                    bg-black/90 backdrop-blur-sm 
                    text-white
                    transition-all duration-300
                    ${isScrolled ? 'shadow-xl' : ''}
                    ${isScrolled ? 'py-2 sm:py-3' : ''}
                `}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Logo />
                    
                    <Navbar />
                    
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-black/50 transition-colors"
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
                </div>
            </header>

            <MobileNav toggleMenu={toggleMenu} isOpen={isOpen} />
        </>
    );
}
