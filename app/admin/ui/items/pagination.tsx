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
import { usePathname } from "next/navigation";
import { getCurrentPage } from "../../lib/utils";
  

export default function ItemsPagination ({totalPages}: {totalPages: number}) {
    const pathname = usePathname();
    const currentPage = getCurrentPage() || 1
    const createPageURL = (pageNumber: number | string) => {
        return `${pathname}?page=${pageNumber}`;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={(currentPage - 1).toString()} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}