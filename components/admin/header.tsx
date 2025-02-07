import MobileNav from "./mobile-nav"
import DropDownMenuComponent from "./dropdown-menu"

export default function Header() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-background p-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center justify-between md:justify-end w-full">
        <div className="md:hidden">
          <MobileNav />
        </div>
        <DropDownMenuComponent />
      </div>
    </header>
  )
}
