import OrdersContainer from "@/components/store/order/orders-container";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your order confirmation page',
};

const Page: React.FC = () => {
  
  return (
    <div className="min-h-screen bg-black text-gray-400 pt-24">
      <OrdersContainer />
    </div>
  );
};

export default Page;