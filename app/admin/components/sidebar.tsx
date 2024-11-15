// /components/ui/Sidebar.tsx
import Link from "next/link"
import { Home, ShoppingCart, SquareMenu, Users, LineChart, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"


export default function Sidebar() {
  return (
    <aside className="hidden border-2 w-60 bg-gray-100 p-4 border-r md:flex md:flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
        Little Tokyo Sushi
      </Link>

      {/* Main Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-3">
          {[
            { label: 'Dashboard', icon: <Home />, link: '/' },
            { label: 'Orders', icon: <ShoppingCart />, link: '/orders', badge: 4 },
            { label: 'Items', icon: <SquareMenu />, link: '/items' },
            { label: 'Employees', icon: <Users />, link: '/employees' },
            { label: 'Reports', icon: <LineChart />, link: '/reports' },
          ].map((item) => (
            <li key={item.label}>
              <Link
                href={item.link}
                className="flex items-center justify-between p-2 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
                {item.badge && <Badge>{item.badge}</Badge>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto" />

      <div className="mt-4"> 
        <Link
          href="/settings"
          className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <Settings className="w-5 h-5" /> Settings
        </Link>
        
      </div>
    </aside>
    
  )
}
