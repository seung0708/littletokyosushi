import { Database } from '@/types/database.types';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import RefundSection from './refund-section';

type Order = Database['public']['Tables']['orders']['Row'] & {
    customer: Database['public']['Tables']['customers']['Row'];
    items: Array<
        Database['public']['Tables']['order_items']['Row'] & {
            menu_item: Database['public']['Tables']['menu_items']['Row'];
            itemModifiers: Array<
                Database['public']['Tables']['order_item_modifiers']['Row'] & {
                    options: Array<
                        Database['public']['Tables']['order_item_modifier_options']['Row']
                    >;
                }
            >;
        }
    >;
};

interface OrderDetailsProps {
    order: Order;
    onRefund: (values: any) => Promise<void>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onRefund }) => {
    const calculateItemTotal = (item: Order['order_items'][0]) => {
        
        const modifierTotal = item.itemModifiers.reduce((total, modifier) => {
            return total + modifier.options.reduce((optTotal, opt) => 
                optTotal + opt.price, 0
            );
        }, 0);
        return (item.price + modifierTotal) * item.quantity;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-6">
               
                <Badge 
                    variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                        order.status === 'processing' ? 'destructive' :
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
                        <p className="mt-1">{order.customerFirstName + ' ' + order.customerLastName || 'Guest'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="mt-1">{order.customerPhone || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                {item.itemModifiers.map((modifier) => (
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
                                {item.specialInstructions && (
                                    <p className="text-sm text-gray-500 ml-4">Note: {item.specialInstructions}</p>
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