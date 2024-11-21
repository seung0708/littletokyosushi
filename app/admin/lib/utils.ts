'use client';
import { useRouter } from "next/navigation"

export const getCurrentPage = () => {
    const router = useRouter();
    const page = router.query.page;
    return Number(page);
}