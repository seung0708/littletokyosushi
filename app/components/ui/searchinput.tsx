// /components/ui/SearchInput.tsx
import { Search } from "lucide-react"

export default function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-2.5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full py-2 pl-10 pr-4 text-sm bg-gray-200 rounded-lg focus:bg-white focus:outline-none"
      />
    </div>
  )
}
