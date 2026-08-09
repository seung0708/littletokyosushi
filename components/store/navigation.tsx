import DesktopNav from './nav/DesktopNav';
import Banner from './nav/Banner';
import MobileNav from './nav/MobileNav'

export default function Navbar()
 {
    return(
        <nav aria-label="Top">
            <Banner />
            <MobileNav />
            <DesktopNav />
        </nav>
    );
}
