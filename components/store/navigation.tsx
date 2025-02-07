import NavLink from "@/components/store/ui/nav/navLink";
import CartIcon from "@/components/store/ui/nav/cart-icon";

const Navbar: React.FC = () => {
    return(
        <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
                href="/about" 
                className="text-sm font-medium hover:text-gray-300 transition-colors" 
            >
                About
            </NavLink>       
            <NavLink 
                href="/contact" 
                className="text-sm font-medium hover:text-gray-300 transition-colors" 
            >
                Contact
            </NavLink>
            <NavLink 
                href="/menu" 
                className="text-sm font-medium hover:text-gray-300 transition-colors" 
            >
                Menu
            </NavLink>
            <div className="relative">
                <CartIcon />
            </div>
        </nav>
    );
}

export default Navbar;