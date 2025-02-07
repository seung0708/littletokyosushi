import { Order } from '@/types/order';

export default function OrderSummary({order}: {order: Order}) {
  return (
    <ul className="grid gap-3">
      <li className="flex items-center justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>${order.sub_total.toFixed(2)}</span>
      </li>
      <li className="flex items-center justify-between">
        <span className="text-muted-foreground">Service Fee</span>
        <span>${order.service_fee.toFixed(2)}</span>
      </li>
      <li className="flex items-center justify-between font-semibold">
        <span className="text-muted-foreground">Total</span>
        <span>${order.total.toFixed(2)}</span>
      </li>
    </ul>
  )
}