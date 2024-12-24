'use client';

import { useAuth } from "../../../../app/context/authContext"
import NavLink from "./navLink"

export default function Links({ className = "", showSpan = false }) {
    const { user, signout } = useAuth();  // Destructure the signOut function from the context

    const publicLinks = [
        { name: 'About', href: '/#about' },
        { name: 'Contact', href: '/#contact' },
        { name: 'Menu', href: '/menu' },
    ];

    const authLinks = user
        ? [
            { name: 'Account', href: '/account' },
            { name: 'Sign Out', href: '/', onClick: signout },
        ]
        : [
            { name: 'Sign In', href: '/signin' },
        ];

    const links = [...publicLinks, ...authLinks];

    return (
        <>
            {links.map(link => (
                <NavLink
                    key={link.name}
                    link={link}
                    className={className}
                    showSpan={showSpan}
                />
            ))}
        </>
    );
}