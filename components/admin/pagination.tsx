'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function Pagination ({totalPages}: {totalPages: number}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => replace(createPageURL(currentPage - 1))}
                disabled={currentPage <= 1}
            >
                <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => replace(createPageURL(currentPage + 1))}
                disabled={currentPage >= totalPages}
            >
                <ChevronRightIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}