import NavLink from "@/components/store/ui/nav/navLink";
import CartIcon from './ui/nav/cart-icon';

const navLinks = [
    {name: "Menu", href:"/menu"}, 
    {name: "About", href: "/about"},
    {name: "Contact Us", href: "/contact"}
]


export default function Navbar({isScrolled}) {
    return(
        <div className="hidden items-center gap-8 md:flex">
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
