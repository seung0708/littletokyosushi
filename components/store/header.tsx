'use client';
import {useState, useEffect} from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./navigation"
import MobileNav from './mobilenav';
import Logo from './ui/nav/logo';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setIsOpen(false);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <header className="fixed w-full flex items-center justify-between px-4 py-2 bg-black text-white z-10">
                <Logo />
                <Navbar toggleMenu={toggleMenu} isOpen={isOpen} aria-label="Top"/>
                
            </header>
            <MobileNav toggleMenu={toggleMenu} isOpen={isOpen} />
        </>
    );
}
