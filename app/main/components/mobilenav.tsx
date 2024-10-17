import Link from "next/link";

interface MobileNavProps {
    toggleMenu: () => void; 
    isOpen: boolean
}

const MobileNav: React.FC<MobileNavProps> = ({toggleMenu, isOpen}) => {
    return (
        <>
        {isOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-gray-900 text-white px-12" role="dialog" aria-modal="true">
            <div className="flex flex-col p-4">
                <ul role="list" aria-labelledby="heading-mobile" className="flex flex-col space-y-4">
                    <Link href="/#about" onClick={toggleMenu}>About</Link>
                    <Link href="/#contact" onClick={toggleMenu}>Contact Us</Link>
                    <Link href="/menu" onClick={toggleMenu}>Menu</Link>
                </ul>
            </div>
        </div>
        )}
        </>
    )
}

export default MobileNav;