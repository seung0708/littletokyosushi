'use client'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "lucide-react";

interface RefundSectionProps {
    order: any;
    onRefund: (values: any) => Promise<void>;
  }
  
  export default function RefundSection({ order, onRefund }: RefundSectionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [refundHistory, setRefundHistory] = useState<any[]>([]);
  
    const fetchRefundHistory = async () => {
      const response = await fetch(`/api/admin/orders/${order.short_id}/refunds`);
      const data = await response.json();
      setRefundHistory(data);
    };
  
    useEffect(() => {
      fetchRefundHistory();
    }, [order.short_id]);
  
    const totalRefunded = refundHistory.reduce((sum, refund) => sum + refund.amount, 0);
    const remainingRefundable = order.total - totalRefunded;
  
    const refundSchema = z.object({
      amount: z
        .number()
        .min(0.01, "Refund amount must be greater than 0")
        .refine(
          (amount) => amount <= remainingRefundable,
          `Cannot refund more than remaining amount: $${remainingRefundable.toFixed(2)}`
        ),
      reason: z
        .string()
        .min(1, "Reason is required")
        .max(500, "Reason cannot exceed 500 characters")
    });
  
    const form = useForm<z.infer<typeof refundSchema>>({
      resolver: zodResolver(refundSchema),
      defaultValues: {
        amount: remainingRefundable,
        reason: ''
      }
    });
  
    const handleSubmit = async (values: z.infer<typeof refundSchema>) => {
      setIsLoading(true);
      try {
        await onRefund(values);
        await fetchRefundHistory();
        form.reset();
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Refund Information</h3>
          <div className="text-sm text-muted-foreground">
            <p>Total Refunded: ${totalRefunded.toFixed(2)}</p>
            <p>Remaining: ${remainingRefundable.toFixed(2)}</p>
          </div>
        </div>
  
        {refundHistory.length > 0 && (
          <div className="rounded-md bg-muted p-4">
            <h4 className="font-medium mb-2">Refund History</h4>
            <ul className="space-y-2">
              {refundHistory.map((refund) => (
                <li key={refund.id} className="text-sm flex justify-between">
                  <div>
                    <p>${refund.amount.toFixed(2)} - {refund.reason}</p>
                    <p className="text-muted-foreground">
                      {format(new Date(refund.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Badge variant={refund.status === 'succeeded' ? 'success' : 'secondary'}>
                    {refund.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {remainingRefundable > 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={remainingRefundable}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                variant="destructive"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing Refund...' : 'Process Refund'}
              </Button>
            </form>
          </Form>
        )}
      </div>
    );
  }