import { Button } from '@/app/ui/buttons';
import Svg from '../svg';

interface CloseMenuProps {
    toggleMenu: () => void;   
}

 const CloseMenu: React.FC<CloseMenuProps> = ({toggleMenu}) => {
    return (
        <Button 
            type="button"
            className="rounded-md p-2 text-white-900"
            onClick={toggleMenu}
        >
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open menu</span>
            <Svg className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </Svg>
        </Button>
    )
}

export default CloseMenu;
