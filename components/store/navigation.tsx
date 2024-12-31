'use client';
import { useAuth } from "@/app/context/authContext";
import NavLink from "@/components/store/ui/nav/navLink";
import HamburgerMenu from "@/components/store/ui/nav/hamburger-menu";
import CloseMenu from "@/components/store/ui/nav/close-menu";
import Logo from "@/components/store/ui/nav/logo";
import CartIcon from "@/components/store/ui/nav/cart-icon";

interface NavbarProps {
    className?: string,
    isOpen: boolean
    toggleMenu: () => void

}

const Navbar: React.FC<NavbarProps> = ({className, isOpen, toggleMenu}) => {
    const { user } = useAuth();
    return(
        <nav className={className}>
            <div className="">
                <div className="flex h-16 items-center">
                    <div className="relative md:hidden">
                        {isOpen ? (
                            <CloseMenu toggleMenu={toggleMenu} />
                        ) : (
                            <HamburgerMenu toggleMenu={toggleMenu} />
                        )}
                    </div>
                    <div className="flex justify-center ml-auto md:ml-0">
                       <Logo />
                    </div>
                    <div className="ml-auto flex items-center">
                        <div className="text-sm md:text-md space-x-4 flex justify-between items-center text-white md:text-lg">
                            <div className="hidden md:flex md:items-center md:justify-between md:space-x-8 lg:space-x-14">
                                <NavLink href="/#about" className="relative inline-block group" showSpan={true}>About</NavLink>       
                                <NavLink href="/#contact" className="relative inline-block group" showSpan={true}>Contact</NavLink>
                                <NavLink href="/menu" className="relative inline-block group" showSpan={true}>Menu</NavLink>
                                <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span>
                            </div>
                           
                            {!user ? (
                            <div>
                                <NavLink href="/signin" className="relative inline-block group" showSpan={true}>Sign In</NavLink>
                                <span>/</span>
                                <NavLink href="/signup" className="relative inline-block group" showSpan={true}>Sign Up</NavLink>
                            </div>
                            ) : (
                                <div>
                                    <NavLink href="/account" className="relative inline-block group" showSpan={true}>Account</NavLink>
                                    <span>/</span>
                                    <NavLink href="/logout" className="relative inline-block group" showSpan={true}>Logout</NavLink>
                                </div>
                            )}
                        </div>
                        <CartIcon />                        
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar