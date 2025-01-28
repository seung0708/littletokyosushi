import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from "@/components/ui/card"

import OrderItems from "./order-items"
import { Separator } from "@radix-ui/react-dropdown-menu"
import OrderSummary from "./order-summary"
import CustomerInfo from "./customer-info"
import RefundSection from "./refund-section"

interface OrderDetailsProps {
  order: any;
  onRefund: (values: any) => Promise<void>;
}

export default function OrderDetails({order, onRefund}: OrderDetailsProps) {
    return (
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <OrderItems order={order} />
          <Separator className="my-2" />
          <OrderSummary order={order} />
          <Separator className="my-2" />   
          <RefundSection order={order} onRefund={onRefund} />
        </div>
        <Separator className="my-4" />
        <CustomerInfo order={order} />
      </CardContent>
    )
}