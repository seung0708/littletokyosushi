'use client';
import {useState} from 'react';
import Image from "next/image"
import Navbar from "./navigation"
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from '@/app/ui/buttons';
import Svg from '@/app/ui/svg';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Header */}
            <header className="relative bg-gray-900 text-white z-10">
                <Navbar toggleMenu={toggleMenu} isOpen={isOpen} aria-label="Top" className='px-8 py-1 sm:py-1.5 sm:px-12 lg:px-16'/>
                    
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-x-0 top-16 z-40 bg-gray-900 text-white px-12" role="dialog" aria-modal="true">
                    <div className="flex flex-col p-4">
                        <ul role="list" aria-labelledby="women-clothing-heading-mobile" className="flex flex-col space-y-4">
                            <li>
                                <a href="/#about" onClick={toggleMenu}>About</a>
                            </li>
                            <li>
                                <a href="/#contact" onClick={toggleMenu}>Contact Us</a>
                            </li>
                            <li>
                                <a href="/menu" onClick={toggleMenu}>Menu</a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}




//         <header classNameName="flex justify-between items-center p-4 sm:p-6 shadow-lg">
//             <div classNameName="flex items-center gap-3">
//                 <Image 
//                     src="/assets/images/logo.png" 
//                     alt="logo" 
//                     width={50} 
//                     height={50} 
//                     classNameName="w-10 h-10 sm:w-12 sm:h-12"
//                 />
//             </div>
//             <div classNameName="flex items-center gap-3 sm:gap-4">
//                 <div classNameName="hidden sm:block">
//                     <Navbar isToggle={isToggle} />
//                 </div>
//                 <button classNameName="relative bg-red-500 p-2 sm:p-3 rounded-full text-white">
//                     <ShoppingBag size={18} />
//                     <span classNameName="absolute -top-1.5 -right-1.5 bg-white text-xs text-red-500 font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                         0
//                     </span>
//                 </button>
//                 <button classNameName="sm:hidden p-2" onClick={() => setIsToggle(!isToggle)}>
//                     <Menu size={24}/>
//                 </button>
//             </div>
// </header>