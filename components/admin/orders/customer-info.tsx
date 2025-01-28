export default function CustomerInfo({order}: {order: any}) {
    return (
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
    )
}