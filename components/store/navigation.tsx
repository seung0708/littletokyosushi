import NavLink from "@/components/store/ui/nav/navLink";

const Navbar: React.FC = () => {
    return(
        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <NavLink 
                href="/about" 
                className="font-medium text-base lg:text-lg hover:text-red-400 transition-all duration-200 hover:scale-105" 
            >
                About
            </NavLink>       
            <NavLink 
                href="/contact" 
                className="font-medium text-base lg:text-lg hover:text-red-400 transition-all duration-200 hover:scale-105" 
            >
                Contact
            </NavLink>
            <NavLink 
                href="/menu" 
                className="font-medium text-base lg:text-lg hover:text-red-400 transition-all duration-200 hover:scale-105" 
            >
                Menu
            </NavLink>
        </nav>
    );
}

export default Navbar;