'use client'
// /components/ui/Sidebar.tsx
import Link from "next/link"
import { Home, ShoppingCart, SquareMenu, Users, LineChart, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden border-2 w-60 bg-gray-100 p-4 border-r md:flex md:flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
        Little Tokyo Sushi
      </Link>

      {/* Main Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
              <Link 
                href="/dashboard" 
                onClick={() => setOpen(false)}
                className={clsx('flex items-center text-gray-700 rounded-lg px-2', 
                {
                  'bg-gray-400 text-gray-800 p-2' : pathname === '/dashboard'
                })}
              >
                <div className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Dashboard
               </div>
            </Link>
          </li>
          <li>
            <Link 
              href="/orders"
              onClick={() => setOpen(false)}
              className={clsx('flex items-center text-gray-700 rounded-lg px-2', 
              {
               'bg-gray-400 text-gray-800 p-2' : pathname === '/orders'
              })}
            >
               <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Orders
               </div>
            </Link>
          </li>
          <li>
            <div className="relative">
              <Link 
                href="/items"
                onClick={(e) => {
                  if (!pathname.startsWith('/items')) {
                    setOpen(true);
                  }
                }}
                className={clsx(
                  'flex items-center text-gray-700 rounded-lg px-2 w-full', 
                  {
                    'bg-gray-400 text-gray-800 p-2' : pathname === '/items' || pathname === '/items/modifiers'
                  })}
              >
                <div className="flex items-center gap-2">
                  <SquareMenu className="h-5 w-5" />
                  Menu
                </div>
              </Link>
              {open && (
                <div className="absolute left-0 w-full mt-1">
                  <Link 
                    href="/items/modifiers"
                    className={clsx(
                      'flex items-center text-gray-700 rounded-lg px-4 w-full',
                      {
                        'bg-gray-200 text-gray-800 p-2': pathname === '/items/modifiers'
                      })}
                  >
                    <div className="flex items-center gap-2">
                      Modifiers
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </li>
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
