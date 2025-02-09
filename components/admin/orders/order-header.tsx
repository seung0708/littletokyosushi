import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PrepTimeTimer from "./prep-time-timer";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { format } from "date-fns";
import { Order } from '@/types/order';

export function OrderHeader({order}: {order: Order}) {
    return (
        <CardHeader className="flex flex-row items-start bg-muted/50 md:pl-64">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Order {order.short_id}
                {order.status === 'preparing' && (
                  <PrepTimeTimer 
                    prepTimeMinutes={order.prep_time_minutes} 
                    startTime={order.prep_time_confirmed_at} 
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
                {order.order_type === 'pickup' && (
                  <>
                    {format(new Date(order.pickup_date.split('+')[0]), 'EEE, M/d/yy')}{' '}
                    {order.pickup_time && (
                      <>
                        {(() => {
                          const [hours, minutes] = order.pickup_time.split(':');
                          const date = new Date();
                          date.setHours(parseInt(hours, 10));
                          date.setMinutes(parseInt(minutes, 10));
                          return format(date, 'h:mm a');
                        })()}
                      </>
                    )}
                  </>
                )}
                {order.order_type === 'delivery' && order.delivery_date && (
                  format(new Date(order.delivery_date), 'EEEE, MMMM d, yyyy')
                )}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {order.order_type.toUpperCase()}
            </div>
          </CardHeader>
    )
}