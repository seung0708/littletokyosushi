import { motion } from 'framer-motion';

interface CartBadgeProps {
    count: number;
    className?: string;
}

export const CartBadge = ({ count, className = '' }: CartBadgeProps) => {
    return (
        <motion.div
            key={count} // This forces animation on count change
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium ${className}`}
        >
            {count}
        </motion.div>
    )
}