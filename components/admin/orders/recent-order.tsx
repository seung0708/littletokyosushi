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

export default function RecentOrder({order}: {order: any}) {
  console.log(order)
  const [lastChanged, setLastChanged] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [printContainer, setPrintContainer] = useState<HTMLElement | null>(null);

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
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Order {order.short_id}
                {order.status === 'preparing' && (
                  <PrepTimeTimer 
                    prepTimeMinutes={order.prepTime} 
                    startTime={order.prepTimeConfirmedAt} 
                    status={order.status}
                  />
                )}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Order ID</span>
                </Button>
              </CardTitle> 
              <CardDescription>
                {order.type === 'pickup' && (
                  <>
                    {format(new Date(order.pickupDate), 'EEEE, MMMM d, yyyy')}{' '}
                    {order.pickupTime && (
                      <>
                        {(() => {
                          const [hours, minutes] = order.pickupTime.split(':');
                          const date = new Date();
                          date.setHours(parseInt(hours, 10));
                          date.setMinutes(parseInt(minutes, 10));
                          return format(date, 'h:mm a');
                        })()}
                      </>
                    )}
                  </>
                )}
                {order.type === 'delivery' && order.deliveryDate && (
                  format(new Date(order.deliveryDate), 'EEEE, MMMM d, yyyy')
                )}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {order.type.toUpperCase()}
            </div>
          </CardHeader>

          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Order Details</div>
              {order.items.map((item: any) => (
              <ul key={order.id.substring(0, 8)} className="grid gap-3">
                <>
                  <li key={item.id.substring(0, 8)}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-muted-foreground">{item.name} x <span>{item.quantity}</span></h3>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      {item.itemModifiers.map((mod: any) => (
                        <div key={mod.id.substring(0, 8)} className="text-sm">
                          <p className="text-muted-foreground font-medium">{mod.name}:</p>
                        <div className="">
                          {mod.options.map((opt: any) => (
                          <p
                            key={opt.id.substring(0, 8)} 
                            className="text-muted-foreground bg-muted px-2 py-1 rounded-md"
                          >
                            {opt.name}
                          </p>
                          ))}
                        </div>
                      </div>
                      ))}
                    </div>
                  </li>
                </>
              </ul>
              ))}
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>${order.serviceFee.toFixed(2)}</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Customer Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{order.customerFirstName} {order.customerLastName}</p>
                </div>
                <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{order.customerPhone || '123-456-7890'}</p>
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>Prep Time (minutes)</FormLabel>
                        <div className="space-y-4">
                          <div className="flex gap-4 items-center">
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-r-none h-10"
                                onClick={() => {
                                  const newValue = Math.max(5, (field.value || 0) - 5);
                                  field.onChange(newValue);
                                  setLastChanged(newValue);
                                }}
                              >
                                -
                              </Button>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={5}
                                  max={60}
                                  step={5}
                                  className="rounded-none w-[80px] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  {...field}
                                  onChange={(e) => {
                                    const value = Math.round(e.target.valueAsNumber / 5) * 5;
                                    field.onChange(value);
                                    setLastChanged(value);
                                  }}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-l-none h-10"
                                onClick={() => {
                                  const newValue = Math.min(180, (field.value || 0) + 5);
                                  field.onChange(newValue);
                                  setLastChanged(newValue);
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </FormItem>
                      )}
                    />
                  </div>
                </div>
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