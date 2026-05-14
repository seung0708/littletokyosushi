import NavLink from "@/components/store/ui/nav/navLink";
import { CartIcon } from './ui/nav/icons';

interface NavbarProps {
    navLinks: { name: string; href: string }[];
    isScrolled: boolean;
}

export default function Navbar({navLinks, isScrolled}: NavbarProps)
 {
    return(
        <div className="hidden sm:flex items-center gap-8">
            {navLinks.map(link => (
                <NavLink 
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white hover:text-white"}`}
                >
                    {link.name}
                </NavLink>
            ))}
            <CartIcon isScrolled={isScrolled} />
        </div>
    );
}
