import DesktopNav from './nav/DesktopNav';
import Banner from './nav/Banner';
import MobileNav from './nav/MobileNav'
import {Category} from '@/types/category';

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
