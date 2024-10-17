interface SVGProps {
    children: React.ReactNode,
    className?: string
}

const Svg: React.FC<SVGProps> = ({children, className}) => {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
        >
            {children}
        </svg>
    )
}

export default Svg;