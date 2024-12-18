'use client';

import { useAuth } from "../../context/authContext"
import NavLink from "./navLink"

export default function Links({ className = "", showSpan = false }) {
    const { user } = useAuth();
    
    const publicLinks = [
        {name: 'About', href: '/#about'},
        {name: 'Contact', href: '/#contact'},
        {name: 'Menu', href: '/menu'},
    ];
    
    const authLinks = user ? [
        {name: 'Account', href: '/account'},
        {name: 'Logout', href: '/logout'},
    ] : [
        {name: 'Login', href: '/login'},
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