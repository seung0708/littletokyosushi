import { Button } from '@/app/(main)/components/ui/buttons';
import Svg from '../ui/svg';

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
            <span className="sr-only">Close menu</span>
            <Svg className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </Svg>
        </Button>
    )
}

export default CloseMenu;
