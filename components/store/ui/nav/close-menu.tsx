import Svg from '../svg';

interface CloseMenuProps {
    toggleMenu: () => void;   
}

const CloseMenu: React.FC<CloseMenuProps> = () => {
    return (
        <>
            <span className="sr-only">Close menu</span>
            <Svg className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </Svg>
        </>
    )
}

export default CloseMenu;
