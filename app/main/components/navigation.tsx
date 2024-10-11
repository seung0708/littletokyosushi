import Link from "next/link";

interface NavbarProps {
    isToggle:boolean
}

const Navbar: React.FC<NavbarProps> = ({isToggle}) => {
    return(
        <>
        <nav className='hidden sm:flex items-center gap-3 m-4 sm'>
            <ul className="flex gap-3">
                <li>
                    <Link href='#about'>About</Link>
                </li>
                <li>
                    <Link href='#about'>Menu</Link>
                </li>
                <li>
                    <Link href='#contact'>Contact</Link>
                </li>
            </ul>
        </nav>
        {isToggle && (
            <nav className="absolute top-20 left-0 w-full bg-gray-900 shadow-lg p-4 sm:hidden">
                <ul className="flex flex-col space-y-4">
                    <li>
                        <Link href='#about'>About</Link>
                    </li>
                    <li>
                        <Link href='#about'>Menu</Link>
                    </li>
                    <li>
                        <Link href='#contact'>Contact</Link>
                    </li>
                </ul>
            </nav>
        )}
        </>
    )
}

export default Navbar