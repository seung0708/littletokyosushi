'use client'
import { useForm } from "react-hook-form"
import { Copy, CreditCard, Printer } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import PrepTimeTimer from "./prep-time-timer"
import PrintReceipt from "./print-receipt"
import { OrderHeader } from "./order-header"
import OrderDetails from "./order-details"
import OrderFooter from "./order-footer"

export default function RecentOrder({order}: {order: any}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const prepTimeSchema = z.object({
    prepTime: z.number()
      .min(5, "Prep time must be at least 5 minutes")
      .max(180, "Prep time cannot exceed 180 minutes"),
  })

  const form = useForm<z.infer<typeof prepTimeSchema>>({
    resolver: zodResolver(prepTimeSchema),
    defaultValues: {
      prepTime: order.prepTime || 10
    },
  })

  const onSubmit = async (values: z.infer<typeof prepTimeSchema>) => {
    try {
      let response = await fetch(`/api/admin/orders/${order.short_id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsConfirmed(true);
    } catch (error) {
      console.error('Error updating prep time:', error);
    }
  }

  const onMarkReady = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${order.short_id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ready' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking order as ready:', error);
    }
  }

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
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <OrderHeader order={order} />
          <OrderDetails order={order} />
          <OrderFooter 
            order={order} 
            onMarkReady={onMarkReady} 
            onPrint={onPrint} 
            isConfirmed={isConfirmed} 
            form={form} 
            onSubmit={onSubmit} 
          />
        </Card>
      </motion.div>
      {ReactDOM.createPortal(
        <PrintReceipt order={order} />,
        document.body
      )}
    </>
  );
}