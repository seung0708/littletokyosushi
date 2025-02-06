import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PrepTimeTimer from "./prep-time-timer";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { format, parseISO } from "date-fns";

export function OrderHeader({order}: {order: any}) {
    return (
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
                    {format(new Date(order.pickupDate.split('+')[0]), 'EEE, M/d/yy')}{' '}
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
    )
}