import NavLink from "@/components/store/ui/nav/navLink";
import { NavProps } from "./header";
import { CartIcon } from './ui/nav/icons';



const MobileNav = ({navLinks, isScrolled}: NavProps) => {
    return (
        <div className="absolute top-full left-0 right-0 border-b border-border bg-background p-6 md:hidden">
            <div className="flex flex-col items-center gap-4">
                {navLinks.map(link => (
                    <NavLink 
                        key={link.name}
                        href={link.href}
                        className="text-lg font-medium text-foreground"
                    >
                        {link.name}
                    </NavLink>
                ))}
                <CartIcon isScrolled={isScrolled} />
            </div>                            
        </div>
    );
}

export default MobileNav;