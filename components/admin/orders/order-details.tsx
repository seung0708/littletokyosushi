import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import OrderItems from "./order-items"
import { Separator } from "@radix-ui/react-dropdown-menu"
import OrderSummary from "./order-summary"
import CustomerInfo from "./customer-info"

export default function OrderDetails({order}: {order: any}) {
    return (
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <OrderItems order={order.items} />
          <Separator className="my-2" />
          <OrderSummary order={order} />   
        </div>
        <Separator className="my-4" />
        <CustomerInfo order={order} />
      </CardContent>
    )
}