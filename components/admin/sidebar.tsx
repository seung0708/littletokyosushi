'use client'
// /components/ui/Sidebar.tsx
import Link from "next/link"
import { Home, ShoppingCart, SquareMenu, Users, LineChart, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useState } from "react"
import { useRouter } from "next/navigation"

// components/admin/sidebar.tsx
export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    menu: false,
    orders: false
  })
  const pathname = usePathname()
  const router = useRouter()

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  return (
    <aside className="hidden border-2 w-60 bg-gray-100 p-4 border-r md:flex md:flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
        Little Tokyo Sushi
      </Link>

      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
            <Link 
              href="/dashboard" 
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
          
          {/* Orders Section */}
          <li>
            <div className="relative">
              <Link 
                href="/orders"
                onClick={() => toggleMenu('orders')}
                className={clsx(
                  'flex items-center text-gray-700 rounded-lg px-2 w-full', 
                  {
                    'bg-gray-400 text-gray-800 p-2' : pathname === '/orders'
                  }
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Orders
                  </div>
                </div>
              </Link>
              
              {openMenus.orders && (
                <div className="mt-1 ml-4 space-y-1">
                  <Link 
                    href="/orders/history"
                    className={clsx(
                      'flex items-center text-gray-700 rounded-lg px-4 py-2 w-full',
                      {
                        'bg-gray-200 text-gray-800': pathname === '/orders/history'
                      }
                    )}
                  >
                    Order History
                  </Link>
                </div>
              )}
            </div>
          </li>

          {/* Menu Section */}
          <li>
            <div className="relative">
              <Link 
                href="/items"
                onClick={() => toggleMenu('menu')}
                className={clsx(
                  'flex items-center text-gray-700 rounded-lg px-2 w-full', 
                  {
                    'bg-gray-400 text-gray-800 p-2' : pathname === '/items'
                  }
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <SquareMenu className="h-5 w-5" />
                    Menu
                  </div>
                </div>
              </Link>
              
              {openMenus.menu && (
                <div className="mt-1 ml-4 space-y-1">
                  <Link 
                    href="/items/modifiers"
                    className={clsx(
                      'flex items-center text-gray-700 rounded-lg px-4 py-2 w-full',
                      {
                        'bg-gray-200 text-gray-800': pathname === '/items/modifiers'
                      }
                    )}
                  >
                    Modifiers
                  </Link>
                  <Link 
                    href="/items/categories"
                    className={clsx(
                      'flex items-center text-gray-700 rounded-lg px-4 py-2 w-full',
                      {
                        'bg-gray-200 text-gray-800': pathname === '/items/categories'
                      }
                    )}
                  >
                    Categories
                  </Link>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  )
}