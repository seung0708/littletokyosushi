'use client';

import { useAuth } from '@/app/context/authContext';
import {useState, useEffect} from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./navigation"
import MobileNav from './mobilenav';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <header className="relative bg-gray-900 text-white z-10">
                <Navbar toggleMenu={toggleMenu} isOpen={isOpen} aria-label="Top" className='px-8 py-1 sm:py-1.5 sm:px-12 lg:px-16'/>    
            </header>
            <MobileNav toggleMenu={toggleMenu} isOpen={isOpen} />
        </>
    );
}
