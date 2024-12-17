import NavLinks from "@/app/(main)/components/nav/nav-links";
import HamburgerMenu from "@/app/(main)/components/nav/hamburger-menu";
import CloseMenu from "@/app/(main)/components/nav/close-menu";
import Logo from "@/app/(main)/components/nav/logo";
import CartIcon from "@/app/(main)/components/nav/cart-icon";

interface NavbarProps {
    className?: string,
    isOpen: boolean
    toggleMenu: () => void

}

const Navbar: React.FC<NavbarProps> = ({className, isOpen, toggleMenu}) => {

    return(
        <nav className={className}>
            <div className="">
                <div className="flex h-16 items-center">
                    <div className="relative lg:hidden">
                        {isOpen ? (
                            <CloseMenu toggleMenu={toggleMenu} />
                        ) : (
                            <HamburgerMenu toggleMenu={toggleMenu} />
                        )}
                    </div>
                    <div className="flex justify-center ml-auto lg:ml-0">
                       <Logo />
                    </div>
                    <div className="ml-auto flex items-center">
                        <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-14 text-white text-lg">
                            <NavLinks className="relative inline-block group" showSpan={true} />
                            <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span>
                        </div>
                        <CartIcon />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar