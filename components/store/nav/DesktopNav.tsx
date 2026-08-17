import {useState} from 'react'
import {navigation} from './navConfig';
import { Bars3Icon } from '@heroicons/react/24/outline'

import Link from 'next/link'

import {Category} from '@/types/category';

import ShoppingCart from '@/components/store/nav/ShoppingCart';

import Logo from './logo';

export default function DesktopNav({categories}: {categories: Category[]}) {
    const [open, setOpen] = useState(false)
    
    return (     
        <div className="bg-black relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo (lg+) */}
                        <Logo />
                        <div className="hidden h-full lg:flex">
                            {/* Mega menus */}
                            <div className="inset-x-0 bottom-0 px-4">
                                <div className="flex h-full justify-center space-x-8">
                                    {navigation.pages.map((page, pageIdx) => (
                                        page.name === 'Menu' ? (
                                            <div key={page.name} className="group relative flex">
                                                <div className="flex">
                                                    <Link href="/menu" className="group relative flex items-center justify-center text-sm font-medium text-white transition-colors duration-200 ease-out hover:text-red data-open:text-indigo-600">
                                                        {page.name}
                                                        <span
                                                            aria-hidden="true"
                                                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="absolute left-0 top-full z-20 w-56 rounded-md bg-white text-sm text-black shadow-lg ring-1 ring-black/5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto">
                                                    <div className="py-2">
                                                        {categories.map((item) => (
                                                            <a key={item.name} href={`menu/${item.name}`} className="block px-4 py-2 hover:bg-gray-50 hover:text-gray-900">
                                                                {item.name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <a key={page.name} href={page.href} className="flex items-center text-sm font-medium text-white hover:text-gray-300">
                                                {page.name}
                                            </a> 
                                        )
                                    ))}
                              </div>
                            </div>
                        </div>
                        {/* Mobile menu and search (lg-) */}
                        <div className="flex flex-1 items-center lg:hidden">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="-ml-2 rounded-md p-2 text-gray-400"
                            >
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        {/* Logo (lg-) */}
                        <a href="#" className="lg:hidden">
                            <span className="sr-only">Little Tokyo Sushi</span>
                            <img
                                alt=""
                                src="/assets/images/logo.png"
                                className="h-8 w-auto"
                            />
                        </a>
                        <ShoppingCart />
                    </div>
                </div>
            </div>
        </div>
    ) 
}

