import {Order, OrderItem, OrderItemModifier} from '@/types/order';

export default function OrderItems({order}: {order: Order}) {
    return (
       <>
       {order.order_items.map((item: OrderItem) => (
              <ul key={order?.short_id} className="grid gap-3">
                <>
                  <li key={item.id.substring(0, 8)}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-muted-foreground">{item.item_name} x <span>{item.quantity}</span></h3>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      {item?.order_item_modifiers?.map((mod: OrderItemModifier) => (
                        <div key={mod.id?.substring(0, 8)} className="text-sm">
                          <p className="text-muted-foreground font-medium">{mod.name}:</p>
                        <div className="">
                          {mod.order_item_modifier_options.map((opt: any) => (
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
       </>
    )
}