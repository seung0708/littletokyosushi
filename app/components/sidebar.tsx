// /components/ui/Sidebar.tsx
import Link from "next/link"
import { Home, ShoppingCart, Package, Users, LineChart, Settings } from "lucide-react"
import Badge from "@/app/components/ui/badge"
import {Card, CardDescription, CardTitle} from "@/app/components/ui/card"

export default function Sidebar() {
  return (
    <aside className="hidden h-full w-60 bg-gray-100 p-4 border-r md:flex md:flex-col">
      {/* Header */}
      <Link href="/dashboard" className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
        <Package className="w-5 h-5" /> Acme Inc
      </Link>

      {/* Main Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-3">
          {[
            { label: 'Dashboard', icon: <Home />, link: '/dashboard' },
            { label: 'Orders', icon: <ShoppingCart />, link: '/orders', badge: 4 },
            { label: 'Live Orders', icon: <Package />, link: '/live-orders' },
            { label: 'Employees', icon: <Users />, link: '/employees' },
            { label: 'Analytics', icon: <LineChart />, link: '/analytics' },
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

      {/* Spacer to push Settings to the bottom */}
      <div className="mt-auto" />

      {/* Settings Link at the bottom */}
      <div className="mt-4"> {/* Add some spacing above Settings */}
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
