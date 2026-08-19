import DesktopNav from './nav/DesktopNav';
import Banner from './nav/Banner';
import MobileNav from './nav/MobileNav'
import {NavProps} from './nav/navConfig'


const Navbar: React.FC<NavProps> = ({open, setOpen}) => {
    return(
        <nav aria-label="Top">
            <Banner />
            <MobileNav open={open} setOpen={setOpen} />
            <DesktopNav open={open} setOpen={setOpen} />
        </nav>
    );
}

export default Navbar;
