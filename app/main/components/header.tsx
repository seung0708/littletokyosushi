'use client';
import {useState} from 'react';
import Image from "next/image"
import Navbar from "./navigation"
import { ShoppingBag, Menu } from "lucide-react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Header */}
            <header className="relative text-white-400 z-10 mb-0 sm:mb-20">
                {/* <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
                    Get free delivery on orders over $100
                </p> */}

                <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center">
                            <div className="relative lg:hidden">
                                <button
                                    type="button"
                                    className="rounded-md p-2 text-white-900"
                                    onClick={toggleMenu}
                                >
                                    <span className="absolute -inset-0.5"></span>
                                    <span className="sr-only">Open menu</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                        data-slot="icon"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </button>

                                {/* Close Button Positioned Over Hamburger */}
                                {isOpen && (
                                   <button
                                    type="button"
                                    className="absolute inset-0 z-20 bg-gray-900 flex items-center justify-center rounded-md p-2 text-white-900"
                                    onClick={toggleMenu}
                                    >
                                   <span className="sr-only">Close menu</span>
                                   <svg
                                       className="h-6 w-6"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth="1.5"
                                       stroke="currentColor"
                                       aria-hidden="true"
                                       data-slot="icon"
                                   >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                   </svg>
                               </button>
                                )}
                            </div>
                            <div className="flex justify-center ml-auto lg:ml-0">
                                <a href="#">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        className="h-11 w-auto"
                                        src={'/assets/images/logo.png'}
                                        alt=""
                                    />
                                </a>
                            </div>
                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:space-x-6">
                                    <a href="#" className="text-sm font-medium text-white-700">About</a>
                                    <a href="#" className="text-sm font-medium text-white-700">Contact</a>
                                    <a href="/menu" className="text-sm font-medium text-white-700">Menu</a>
                                    <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span>
                                </div>
                                <div className="ml-4 flow-root lg:ml-6">
                                    <a href="#" className="group -m-2 flex items-center p-2">
                                        <svg
                                            className="h-6 w-6 flex-shrink-0 text-white-900"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                            />
                                        </svg>
                                        <span className="ml-2 text-sm font-medium text-white-900">0</span>
                                        <span className="sr-only">items in cart, view bag</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-x-0 top-16 z-40 bg-gray-900 shadow-lg" role="dialog" aria-modal="true">
                    <div className="flex flex-col p-4">
                        <ul role="list" aria-labelledby="women-clothing-heading-mobile" className="flex flex-col space-y-4 text-white-800">
                            <li>
                                <a href="#" >About</a>
                            </li>
                            <li>
                                <a href="#">Contact Us</a>
                            </li>
                            <li>
                                <a href="#">Menu</a>
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