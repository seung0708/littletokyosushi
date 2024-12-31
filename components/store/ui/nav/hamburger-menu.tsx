import { Button } from '@/components/ui/button';
import Svg from '../svg';

interface HamburgerMenuProps {
    toggleMenu: () => void;   
}

 const HamburgerMenu: React.FC<HamburgerMenuProps> = ({toggleMenu}) => {
    return (
        <Button 
            type="button"
            className="rounded-md p-2 text-white-900"
            onClick={toggleMenu}
        >
            <span className="sr-only">Open menu</span>
            <Svg className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </Svg>
        </Button>
    )
}

export default HamburgerMenu
