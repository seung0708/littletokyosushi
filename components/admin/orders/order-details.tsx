import { Badge } from "@/components/ui/badge";
import RefundSection from './refund-section';
import { Order, OrderItemModifier, OrderStatus } from '@/types/order';
import { calculateItemTotal } from '@/utils/item';

interface OrderDetailsProps {
    order: Order;
    onRefund: (values: { amount: number; reason: string }) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onRefund }) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-6">
                <Badge 
                   variant={
                    order.status === OrderStatus.COMPLETED ? 'default' :
                    order.status === OrderStatus.PENDING ? 'secondary' :
                    order.status === OrderStatus.PREPARING ? 'destructive' :
                    order.status === OrderStatus.READY ? 'default' :
                    order.status === OrderStatus.CANCELLED ? 'destructive' :
                    'outline'
                }
                >
                    {order.status.split('_').join(' ').toUpperCase()}
                </Badge>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="mt-1">{order.customers.first_name + ' ' + order.customers.last_name || 'Guest'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="mt-1">{order.customers.phone || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <div>
                                <p className="font-medium">{item.item_name}</p>
                                {item?.modifiers?.map((modifier: OrderItemModifier) => (
                                    <div key={modifier.id} className="ml-4 text-sm text-gray-500">
                                        {modifier.name}:
                                        {modifier.options.map((option) => (
                                            <span key={option.id} className="ml-2">
                                                {option.name} (+${option.price.toFixed(2)})
                                            </span>
                                        ))}
                                    </div>
                                ))}
                                <div>
                                <p className="text-sm text-gray-500">Special Instructions</p>
                                {item.special_instructions && (
                                    <p className="text-sm text-gray-500 ml-4">Note: {item.special_instructions}</p>
                                )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p>${calculateItemTotal(item).toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${order.total.toFixed(2)}</p>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <RefundSection order={order} onRefund={onRefund} />
            </div>
        </div>
    );
};

export default OrderDetails;