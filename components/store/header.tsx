'use client';

import {useState, useEffect} from 'react';
import Navbar from "./navigation"

import {Category} from '@/types/category'


export default function Header({categories}: {categories: Category[]}) {
    const [open, setOpen] = useState(false)

    return (
        <div className="bg-white">
            <header className="relative">
                <Navbar categories={categories} />
            </header>
        </div>
    );
}


{/* <Logo />
                <nav className="flex items-center gap-1"> 
                    <Navbar navLinks={navLinks} isScrolled={isScrolled} />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden z-60 ${isScrolled ? "text-foreground" : "text-white"}`}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? 
                            <HamburgerMenu />
                            :
                            <XMenu />
                        }
                        {/* Mobile Menu */}
                    //     {isMobileMenuOpen && (
                    //         <MobileNav navLinks={navLinks} isScrolled={isScrolled} />
                    //     )}
                    // </button>
                //</nav> */}