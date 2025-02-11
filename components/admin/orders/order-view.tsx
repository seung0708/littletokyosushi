import OrderDetails from './order-details';
import OrderFooter from './order-footer';
import { Order } from '@/types/order';
import OrderHeader  from './order-header';

interface OrderViewProps {
    order: Order;
    onRefund: (values: { amount: number; reason: string }) => void;
}

const OrderView: React.FC<OrderViewProps> = ({ order, onRefund }) => {
    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">
                    Order not found
                </div>
            </div>
        );
    }

    return (
        <div className="ml-64 flex-1 p-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <OrderHeader order={order} />
                <OrderDetails order={order} onRefund={onRefund} />
                <OrderFooter order={order} />
            </div>
        </div>
    );
};

export default OrderView;