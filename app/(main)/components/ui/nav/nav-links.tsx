import clsx from 'clsx';
import Link from "next/link"

interface NavLinksProps {
    className?: string
    showSpan?: boolean
}

export default function NavLinks({className, showSpan = false}: NavLinksProps): JSX.Element  {
    const links = [
     
        {name: 'About', href: '/#about'},
        {name: 'Contact', href: '/#contact'},
        {name: 'Menu', href: '/menu'}
    ];
    
    return (
        <>
        {links.map(link => {
            return (
                <Link
                    key={link.name}
                    href={link.href}
                    className={className}
                >
                    {link.name}
                    {showSpan && (<span className='absolute left-0 -bottom-1 w-full h-0.5 bg-red-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100'></span>
                    )}
                </Link>
            )
        })}
        </>
    );
}