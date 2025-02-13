import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useBackButton = (onBack?: () => void) => {
    const router = useRouter();

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (onBack) {
                onBack();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [onBack]);

    return router;
};

export default useBackButton;