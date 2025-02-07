import OrderDetails from "./order-details";
import OrderFooter from "./order-footer";

import { useForm } from "react-hook-form";
import {Card} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion} from "framer-motion";
import { useState } from "react";
import { OrderHeader } from "./order-header";
import {Order, OrderItemModifier, OrderItemModifierOption} from "@/types/order";
import { calculateItemTotal } from "@/utils/item";

export default function RecentOrder({order}: {order: Order}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const prepTimeSchema = z.object({
    prepTime: z.number()
      .min(5, "Prep time must be at least 5 minutes")
      .max(180, "Prep time cannot exceed 180 minutes"),
  })

  const form = useForm<z.infer<typeof prepTimeSchema>>({
    resolver: zodResolver(prepTimeSchema),
    defaultValues: {
      prepTime: order.prep_time_minutes || 10
    },
  })

  const onComplete = async () => {
    try {
      const response = await fetch(`/api/orders/${order.short_id}`, { 
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'completed',
          archived: true,
          completed_at: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const onRefund = async (values: { amount: number; reason: string }) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.short_id}/refunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process refund');
      }
  
      // Show success message or update UI
    } catch (error) {
      console.error('Error processing refund:', error);
      // Show error message
    }
  };

  const onSubmit = async (values: z.infer<typeof prepTimeSchema>) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.short_id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the updated order data
      await response.json();
      
      setIsConfirmed(true);
    } catch (error) {
      console.error('Error updating prep time:', error);
    }
  }

  const onMarkReady = async () => {
    try {
      const response = await fetch(`/api/orders/${order.short_id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'ready'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      
    } catch (error) {
      console.error('Error marking order as ready:', error);
    }
  };

  const onPrint = () => {
    // Create print content
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.contentWindow?.document.write(`
        <html>
        <head>
            <title>Order Receipt #${order?.short_id?.toUpperCase()}</title>
            <style>
              @page {
                margin: 8px;
                padding: 8px;
              }
                * {
                    font-size: 14px;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: monospace;
                    width: auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 8px;
                }
                .header h2 {
                    font-size: 24px;
                }
                .header p {
                    font-size: 18px;
                }
                .customer, .items, .item {
                    margin-bottom: 8px;
                }
                .modifier {
                    padding-left: 16px;
                    font-size: 0.9em;
                }
                .total {
                    margin-top: 16px;
                    border-top: 1px dashed black;
                    padding-top: 8px;
                }
                .footer {
                    margin-top: 16px;
                    text-align: center;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Little Tokyo Sushi</h2>
                <p>Order #${order?.short_id?.toUpperCase()}</p>
                <p>
                    ${format(new Date(order?.pickup_date?.split('+')[0]), 'EEE, M/d/yy')} 
                    ${order?.pickup_time && (
                        `${(() => {
                            const [hours, minutes] = order?.pickup_time?.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours, 10));
                            date.setMinutes(parseInt(minutes, 10));
                            return format(date, 'h:mm a');
                          })()}`
                      )}
                </p>
            </div>

            <div class="customer">
                <p>Customer: ${order.customers?.first_name + ' ' + order.customers?.last_name || 'Guest'}</p>
                ${order.customers?.phone ? `<p>Phone: ${order.customers?.phone}</p>` : ''}
            </div>

            <div class="items">
                ${order.items.map(item => `
                    <div class="item">
                        <p>${item.quantity}x ${item.item_name} - $${calculateItemTotal(item).toFixed(2)}</p>
                        ${item?.modifiers?.map((modifier: OrderItemModifier) => `
                            <div class="modifier">
                                ${modifier.options?.map((option: OrderItemModifierOption) => 
                                    `<p>• ${option.name}</p>`
                                ).join('')}
                            </div>
                        `).join('')}
                        ${item?.special_instructions ? `<div class="modifier">Note: ${item.special_instructions}</div>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="total">
                <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
            </div>

            <div class="footer">
                <p>Thank you for your order!</p>
                <p>Visit us again at Little Tokyo Sushi</p>
            </div>
        </body>
        </html>
    `);

    // Print and cleanup
    iframe.contentWindow?.document.close();
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
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
          <OrderDetails order={order} onRefund={onRefund} />
          <OrderFooter 
            order={order} 
            onMarkReady={onMarkReady} 
            onPrint={onPrint} 
            isConfirmed={isConfirmed} 
            form={form} 
            onSubmit={onSubmit} 
            onComplete={onComplete}
          />
        </Card>
      </motion.div>
    </>
  );
}

 