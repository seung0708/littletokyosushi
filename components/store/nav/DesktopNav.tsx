import {useState} from 'react'
import {navigation} from './navConfig';
import { Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ShoppingCart from '@/components/store/nav/ShoppingCart';
import Logo from './logo';

export default function DesktopNav() {
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
                                        </div>
                                        
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

