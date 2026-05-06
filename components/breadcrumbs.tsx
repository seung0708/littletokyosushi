import Link from 'next/link';

export default function Breadcrumbs() {
    return (
        <Link href="/menu" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-accent transition-colors mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to menu
      </Link>
    )
}