import NavLink from "@/components/store/ui/nav/navLink";
import HamburgerMenu from "@/components/store/ui/nav/hamburger-menu";
import CloseMenu from "@/components/store/ui/nav/close-menu";
import Logo from "@/components/store/ui/nav/logo";
import CartIcon from "@/components/store/ui/nav/cart-icon";

interface NavbarProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({isOpen, toggleMenu}) => {
    return(
        <nav className="flex items-center justify-between">
            <div className="md:hidden flex items-center">
                <button 
                    className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={toggleMenu}
                    aria-expanded={isOpen}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <CloseMenu toggleMenu={toggleMenu} /> : <HamburgerMenu toggleMenu={toggleMenu} />}
                </button>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink 
                        href="/about" 
                        className="text-sm hover:text-gray-300 transition-colors" 
                        showSpan={true}
                    >
                        About
                    </NavLink>       
                    <NavLink 
                        href="/contact" 
                        className="text-sm hover:text-gray-300 transition-colors" 
                        showSpan={true}
                    >
                        Contact
                    </NavLink>
                    <NavLink 
                        href="/menu" 
                        className="text-sm hover:text-gray-300 transition-colors" 
                        showSpan={true}
                    >
                        Menu
                    </NavLink>
                </div>
                <div className="relative">
                    <CartIcon />  
                </div>
            </div>
            
        </nav>
    )
}

export default Navbar



 {/* <div className="text-sm flex md:text-md space-x-4 text-white md:text-lg">
                {!user ? (
                    <div className="flex space-x-4">
                        <NavLink href="/signin" className="" showSpan={true}>Sign In</NavLink>
                            
                        <NavLink href="/signup" className="hidden md:block" showSpan={true}>Sign Up</NavLink>
                    </div>
                ) : (
                    <div>
                        <NavLink href="/account" className="" showSpan={true}>Account</NavLink>
                            <span>/</span>
                        <NavLink href="/" className="" showSpan={true} onClick={() => signout()}>Logout</NavLink>
                    </div>
                )}
                 
            </div>                           */}