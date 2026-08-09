import DesktopNav from './nav/DesktopNav';

export default function Navbar({navLinks, isScrolled}: NavProps)
 {
    return(
        <nav aria-label="Top">
            <DesktopNav />
        </nav>
    );
}
