import Link from "next/link";

type NavLinkProps = {
    link: {name: string, href: string, onClick?: () => void},
    className: string,
    showSpan?: boolean,

};

export default function NavLinks({link, className, showSpan = false}: NavLinkProps) {
    return (
        <Link key={link.name} href={link.href} className={className} onClick={link.onClick}>
            {link.name}
            {showSpan && (<span className='absolute left-0 -bottom-1 w-full h-0.5 bg-red-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100'></span>
            )}
        </Link>
    );
}