'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/utils';
import OrderCounter from './orders/order-counter';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
    };

    const closeMenu = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/orders', label: 'Orders' },
        { href: '/admin/items', label: 'Menu Items' },
        // { href: '/analytics', label: 'Analytics' },
        // { href: '/settings', label: 'Settings' },
    ];

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMenu}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </Button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}
            <div
                className={cn(
                    'fixed top-0 left-0 bottom-0 w-full max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <nav className="h-full overflow-y-auto">
                    <div className="flex flex-col p-4">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                        </div>

                        <ul className="space-y-3">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={closeMenu}
                                        className={cn(
                                            'block px-4 py-2 text-sm rounded-lg transition-colors',
                                            pathname === item.href
                                                ? 'bg-gray-100 text-gray-900 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        )}
                                    >
                                        {item.label} 
                                        {item.label === 'Orders' && <span className="ml-2"><OrderCounter /></span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto pt-6 border-t">
                    
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}