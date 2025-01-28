export default function OrderSummary({order}: {order: any}) {
  return (
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
  )
}