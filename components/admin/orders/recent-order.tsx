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

export default function RecentOrder({order}: {order: any}) {
  console.log(order)
  const [lastChanged, setLastChanged] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [printContainer, setPrintContainer] = useState<HTMLElement | null>(null);

  
  const refundSchema = z.object({
    amount: z.number()
      .min(0.01, "Refund amount must be greater than 0")
      .max(order.total, "Refund cannot exceed order total"),
    reason: z.string()
      .min(1, "Reason is required")
      .max(500, "Reason cannot exceed 500 characters")
  });

 

  const currentPrepTime = form.watch("prepTime");

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
    // Before printing
    const originalBodyWidth = document.body.style.width;
    document.body.style.width = '72mm';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    const printSettings = {
      margin: 0,
      scale: 1.0
    };
    window.print();
    
    // After printing
    document.body.style.width = originalBodyWidth;
    document.body.style.margin = '';
    document.body.style.padding = '';
  };

  // useEffect(() => {
  //   // Create print container if it doesn't exist
  //   let container = document.getElementById('print-container');
  //   if (!container) {
  //     container = document.createElement('div');
  //     container.id = 'print-container';
  //     document.body.appendChild(container);
  //   }
  //   setPrintContainer(container);
  // }, []);

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
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          
                <div className="flex justify-between items-center gap-4">
                  <AnimatePresence>
                    {!isConfirmed && order.status === 'not_started' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full"
                      >
                        <Button type="submit" className="w-full">
                          Confirm Prep Time
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex gap-2 w-full">
                    {order.status === 'preparing' && (
                      <Button 
                        onClick={onMarkReady}
                        type="button"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Mark as Ready
                      </Button>
                    )}
                    <Button
                      onClick={onPrint}
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print Receipt</span>
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardFooter>
        </Card>
      </motion.div>
      {ReactDOM.createPortal(
        <PrintReceipt order={order} />,
        document.body
      )}
    </>
  );
}