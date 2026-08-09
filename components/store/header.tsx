'use client';

import {useState, useEffect} from 'react';
import Navbar from "./navigation"
import Navigation1 from './navigation1'
import MobileNav from './mobile-nav';
import Logo from './nav/logo';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'

import {navigation} from './nav/navConfig'

import { Bars3Icon, ShoppingCartIcon } from '@heroicons/react/24/outline'


export default function Header() {
    const [open, setOpen] = useState(false)

    return (
        <div className="bg-white">
            <header className="relative">
                <nav aria-label="Top">
                    {/* Banner */}
                    <div className="bg-gray-900 hidden">
                        <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                            <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
                                Get free delivery on orders over $100
                            </p>
                        </div>
                    </div>
        
                    {/* Secondary navigation */}
                    <div className="bg-black">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="border-b border-gray-200">
                                <div className="flex h-16 items-center justify-between">
                                    {/* Logo (lg+) */}
                                    <Logo />
                                    <div className="hidden h-full lg:flex">
                                        {/* Mega menus */}
                                        <PopoverGroup className="inset-x-0 bottom-0 px-4">
                                            <div className="flex h-full justify-center space-x-8">
                                                {navigation.categories.map((category, categoryIdx) => (
                                                    <Popover key={category.name} className="flex">
                                                        <div className="relative flex">
                                                            <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
                                                                {category.name}
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                                                                />
                                                            </PopoverButton>
                                                        </div>
                                                        <PopoverPanel
                                                            transition
                                                            className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                                                            {/* Presentatonal element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                                            <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
                                                                <div className="relative bg-white">
                                                                    <div className="mx-auto max-w-7xl px-8">
                                                                        <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 pt-10 pb-12">
                                                                            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                                                                <div>
                                                                                    <p
                                                                                        id={`desktop-featured-heading-${categoryIdx}`}
                                                                                        className="font-medium text-gray-900"
                                                                                    >
                                                                                        Featured
                                                                                    </p>
                                                                                    <ul
                                                                                        role="list"
                                                                                        aria-labelledby={`desktop-featured-heading-${categoryIdx}`}
                                                                                        className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                                                                        {category.featured.map((item) => (
                                                                                            <li key={item.name} className="flex">
                                                                                                <a href={item.href} className="hover:text-gray-800">
                                                                                                    {item.name}
                                                                                                </a>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                                <div>
                                                                                    <p id="desktop-categories-heading" className="font-medium text-gray-900">
                                                                                        Categories
                                                                                    </p>
                                                                                <ul
                                                                                    role="list"
                                                                                    aria-labelledby="desktop-categories-heading"
                                                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                                                >
                                                                                    {category.categories.map((item) => (
                                                                                        <li key={item.name} className="flex">
                                                                                            <a href={item.href} className="hover:text-gray-800">
                                                                                                {item.name}
                                                                                            </a>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                                                            <div>
                                                                                <p id="desktop-collection-heading" className="font-medium text-gray-900">
                                                                                    Collection
                                                                                </p>
                                                                                <ul
                                                                                    role="list"
                                                                                    aria-labelledby="desktop-collection-heading"
                                                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                                                >
                                                                                    {category.collection.map((item) => (
                                                                                        <li key={item.name} className="flex">
                                                                                            <a href={item.href} className="hover:text-gray-800">
                                                                                                {item.name}
                                                                                            </a>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                            <div>
                                                                                <p id="desktop-brand-heading" className="font-medium text-gray-900">
                                                                                    Brands
                                                                                </p>
                                                                                <ul
                                                                                    role="list"
                                                                                    aria-labelledby="desktop-brand-heading"
                                                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                                                >
                                                                                    {category.brands.map((item) => (
                                                                                        <li key={item.name} className="flex">
                                                                                            <a href={item.href} className="hover:text-gray-800">
                                                                                                {item.name}
                                                                                            </a>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </PopoverPanel>
                                                    </Popover>
                                                ))}
                                                {navigation.pages.map((page) => (
                                                    <a
                                                        key={page.name}
                                                        href={page.href}
                                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                                    >
                                                        {page.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </PopoverGroup>
                                    </div>
        
                                    {/* Mobile menu and search (lg-) */}
                                    <div className="flex flex-1 items-center lg:hidden">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(true)}
                                            className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                                        >
                                            <span className="sr-only">Open menu</span>
                                            <Bars3Icon aria-hidden="true" className="size-6" />
                                        </button>
                                    </div>
        
                                    {/* Logo (lg-) */}
                                    <a href="#" className="lg:hidden">
                                        <span className="sr-only">Your Company</span>
                                        <img
                                            alt=""
                                            src="/assets/images/logo.png"
                                            className="h-8 w-auto"
                                        />
                                    </a>
                                    {/* Shopping Cart */}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
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