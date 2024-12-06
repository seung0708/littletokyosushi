'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation";
import { generatePagination } from "../../utils/utils";

export default function ItemsPagination ({totalPages}: {totalPages: number}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber?.toString());
        return `${pathname}?${params.toString()}`;
    };

    const allPages = generatePagination(currentPage, totalPages);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {allPages.map((page, index) => {
                        let position: 'first' | 'last' | 'single' | 'middle' | undefined;

                        if (index === 0) position = 'first';
                        if (index === allPages.length - 1) position = 'last';
                        if (allPages.length === 1) position = 'single';
                        if (page === '...') position = 'middle';

                        return (
                            <PaginationLink 
                                href={createPageURL(page)}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        )
                    })}
                    
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}