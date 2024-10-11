

interface ToggleButtonProps {
    className?: string;
    children: React.ReactNode;

}

const ToggleButton:React.FC<ToggleButtonProps> = ({className, children}) => {
    const [toggle, setToggle] = useState(false)

    return (
        <button onClick={() => setToggle(!toggle)} className={className}>{children}</button>
    )
}

export default ToggleButton;