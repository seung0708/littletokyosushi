'use client';
import { useAuth } from "@/app/context/authContext";
import NavLink from "@/components/store/ui/nav/navLink";
import HamburgerMenu from "@/components/store/ui/nav/hamburger-menu";
import CloseMenu from "@/components/store/ui/nav/close-menu";
import Logo from "@/components/store/ui/nav/logo";
import CartIcon from "@/components/store/ui/nav/cart-icon";

interface NavbarProps {
    isOpen: boolean
    toggleMenu: () => void

}

const Navbar: React.FC<NavbarProps> = ({isOpen, toggleMenu}) => {
    const { user } = useAuth();
    return(
        <nav className="flex items-center justify-between py-2 px-8">
            <div className=" md:hidden">
                {isOpen ? (
                    <CloseMenu toggleMenu={toggleMenu} />
                ) : (
                    <HamburgerMenu toggleMenu={toggleMenu} />
                )}
            </div>
            <div className="hidden md:flex space-x-4">
                    <NavLink href="/#about" className="" showSpan={true}>About</NavLink>       
                    <NavLink href="/#contact" showSpan={true}>Contact</NavLink>
                    <NavLink href="/menu" className="" showSpan={true}>Menu</NavLink>
            </div>
            <Logo />
            <div className="text-sm flex md:text-md space-x-4 text-white md:text-lg">
                {!user ? (
                    <div>
                        <NavLink href="/signin" className="" showSpan={true}>Sign In</NavLink>
                            
                        <NavLink href="/signup" className="hidden" showSpan={true}>Sign Up</NavLink>
                    </div>
                ) : (
                    <div>
                        <NavLink href="/account" className="" showSpan={true}>Account</NavLink>
                            <span>/</span>
                        <NavLink href="/logout" className="" showSpan={true}>Logout</NavLink>
                    </div>
                )}
                 <CartIcon />  
            </div>                          
        </nav>
    )
}

export default Navbar