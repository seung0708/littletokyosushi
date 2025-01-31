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
        
        // Add passive event listener for better scrolling performance
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
            <header className={`fixed w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-black/90 backdrop-blur-sm text-white z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
                <Logo />
                <Navbar toggleMenu={toggleMenu} isOpen={isOpen} aria-label="Top"/>
            </header>
            <MobileNav toggleMenu={toggleMenu} isOpen={isOpen} />
            {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" aria-hidden="true" onClick={toggleMenu} />}
        </>
    )
}
