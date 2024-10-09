// /components/ui/Badge.tsx
export default function Badge({ children }: { children: React.ReactNode }) {
    return (
      <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">
        {children}
      </span>
    )
  }
  