'use client'

import Link from "next/link"
import { Home, ShoppingCart, SquareMenu, Users, LineChart, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export default function Sidebar() {
  const pathname = usePathname()
  const isMenuExpanded = pathname.startsWith('/items')
  const isOrdersExpanded = pathname.startsWith('/orders')

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white pt-14 transition-transform md:translate-x-0 md:pt-0">
      <div className="flex h-full flex-col overflow-y-auto bg-white px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
          {/* <p className="text-sm text-gray-500">Manage your restaurant</p> */}
        </div>

        <nav className="flex-grow space-y-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Orders</h3>
            <ul className="space-y-1">
              <li>
                <div className="relative">
                  <Link 
                    href="/orders"
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
                  
                  {isOrdersExpanded && (
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
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Menu</h3>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/items" 
                  className={clsx('flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors', 
                    pathname === '/items' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <SquareMenu className="mr-3 h-4 w-4" />
                  <span>Menu Items</span>
                </Link>
                
                {/* {isMenuExpanded && (
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
                    </div>
                  )} */}
              </li>
            </ul>
          </div>

          {/* <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Analytics</h3>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/analytics" 
                  className={clsx('flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors', 
                    pathname === '/analytics' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <LineChart className="mr-3 h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </li>
            </ul>
          </div> */}

          {/* <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Settings</h3>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/settings" 
                  className={clsx('flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors', 
                    pathname === '/settings' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </div> */}
        </nav>
      </div>
    </aside>
  )
}