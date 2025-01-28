'use client'
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { OrderHeader } from "./order-header"
import OrderDetails from "./order-details"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderViewProps {
    order: any
    onRefund: (values: any) => Promise<void>
}

export default function OrderView({order, onRefund}: OrderViewProps) {

  const onPrint = () => {
    const originalBodyWidth = document.body.style.width;
    document.body.style.width = '72mm';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    window.print();
    
    document.body.style.width = originalBodyWidth;
    document.body.style.margin = '';
    document.body.style.padding = '';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <OrderHeader order={order} />
          <CardContent className="grid gap-6">
            <OrderDetails order={order} onRefund={onRefund} />
            <div className="flex justify-between">
              <Button
                onClick={onPrint}
                variant="outline"
                className="flex items-center gap-2"
              >
                Print Receipt
              </Button>
              {!order.archived && (
                <Link href={`/orders/${order.short_id}/edit`}>
                  <Button>Edit Order</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}