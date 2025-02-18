import { Suspense } from 'react'
import { Loading } from '@/components/ui/loading'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Suspense fallback={<Loading variant="admin" />}>{children}</Suspense>
}