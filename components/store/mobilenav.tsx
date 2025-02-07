import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
    toggleMenu: () => void;
    isOpen: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({toggleMenu, isOpen}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-x-0 top-[52px] sm:top-[60px] z-40 bg-black/95 text-white border-t border-white/10" 
                    role="dialog" 
                    aria-modal="true"
                >
                    <nav className="max-w-3xl mx-auto px-4 py-6">
                        <ul className="flex flex-col space-y-4" role="list">
                            <li>
                                <Link 
                                    href="/about" 
                                    onClick={toggleMenu}
                                    className="block py-2 text-lg hover:text-gray-300 transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/contact" 
                                    onClick={toggleMenu}
                                    className="block py-2 text-lg hover:text-gray-300 transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/menu" 
                                    onClick={toggleMenu}
                                    className="block py-2 text-lg hover:text-gray-300 transition-colors"
                                >
                                    Menu
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </motion.div>
            )} 
        </AnimatePresence>
    );
}

export default MobileNav;