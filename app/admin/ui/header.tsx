import MobileNav from "./mobile-nav"
import BreadCrumbNav from "./breadcrumb-nav"
import DropDownMenuComponent from "./dropdown-menu"

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex justify-between h-14 items-center gap-4 border-b bg-background p-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileNav />
      <BreadCrumbNav />
      <DropDownMenuComponent />
    </header>
  )
}
