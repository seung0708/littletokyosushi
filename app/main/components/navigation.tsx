import NavLinks from "@/app/ui/navbar/nav-links";
import HamburgerMenu from "@/app/ui/navbar/hamburger-menu";
import CloseMenu from "@/app/ui/navbar/close-menu";
import Logo from "@/app/ui/navbar/logo";
import CartIcon from "@/app/ui/navbar/cart-icon";

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
                        <HamburgerMenu toggleMenu={toggleMenu} />
                        {isOpen && (
                        <CloseMenu toggleMenu={toggleMenu} />
                        )}
                    </div>
                    <div className="flex justify-center ml-auto lg:ml-0">
                       <Logo />
                    </div>
                    <div className="ml-auto flex items-center">
                        <NavLinks />
                        <CartIcon />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar