import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,   DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Copy, CreditCard, ListFilter, MoreVertical, Truck, File } from "lucide-react"
import OrderSummary from "./components/order-summary"
import OrdersList from "./components/orders-list"
import RecentOrder from "./components/recent-order"

const OrdersPage: React.FC = () => {
    return (
      <section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <OrderSummary />
        </div>
        <OrdersList />
      </div>
      <RecentOrder />
    </section>
    )
}

export default OrdersPage