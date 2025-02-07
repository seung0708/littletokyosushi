import { Order } from '@/types/order';

export default function CustomerInfo({order}: {order: Order}) {
    return (
        <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{order.customers.first_name} {order.customers.last_name}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">{order.customers.phone || '123-456-7890'}</p>
                </div>
            </dl>
        </div>
    )
}