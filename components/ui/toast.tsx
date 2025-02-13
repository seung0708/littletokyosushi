import { motion } from "framer-motion";

interface ToastProps {
    message: string; 
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => (
    <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50
        ${type === 'success' ? 'bg-green-900/90' : 'bg-red-900/90'}`}
>
    <p className="text-white">{message}</p>
    <button onClick={onClose} className="absolute top-2 right-2 text-white/60">×</button>
</motion.div>
)