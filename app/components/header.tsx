// /components/ui/Header.tsx
import SearchInput from "@/app/components/ui/searchinput"
import DropdownMenu from "@/app/components/ui/dropdownmenu"
import { Bell } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 bg-gray-50 px-6 border-b">
      <SearchInput placeholder="Search products..." />
      <div className="flex items-center gap-4">
        <button className="text-gray-500 p-2 hover:bg-gray-200 rounded-full">
          <Bell className="w-5 h-5" />
        </button>
        <DropdownMenu />
      </div>
    </header>
  )
}
