import CartContainer from "@/components/store/cart/cartContainer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cart | Little Tokyo Sushi',
    description: 'Your cart page',
};

const Page: React.FC = () => {
   

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            <CartContainer />
        </div>
    );
}
export default Page