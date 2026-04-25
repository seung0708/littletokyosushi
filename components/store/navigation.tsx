import NavLink from "@/components/store/ui/nav/navLink";
import { CartIcon } from './ui/nav/icons';




export default function Navbar({navLinks, isScrolled}) {
    return(
        <div className="hidden items-center gap-8">
            {navLinks.map(link => (
                <NavLink 
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
                >
                    {link.name}
                </NavLink>
            ))}
            <CartIcon isScrolled={isScrolled} />
        </div>
    );
}
