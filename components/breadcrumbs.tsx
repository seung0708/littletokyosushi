import Link from 'next/link';

export default function Breadcrumbs() {
    return (
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-accent transition-colors mb-8 p-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to menu
      </Link>
    )
}