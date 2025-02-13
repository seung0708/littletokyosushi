import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const EmptyCart = () => (
    <div className="text-center py-16">
        <div className="mb-8">
            <Image
                src="/images/empty-cart.svg"
                alt="Empty cart"
                width={200}
                height={200}
                className="mx-auto"
            />
        </div>
        <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
        <p className="text-gray-400 mb-6">Browse our menu to add some delicious items!</p>
        <Button variant="destructive">
            <Link href='/menu'>View Menu</Link>
        </Button>
    </div>
);

export const EmptyOrders = () => (
    <div className="text-center py-16">
        <h3 className="text-xl font-bold mb-2">No orders yet</h3>
        <p className="text-gray-400 mb-6">Start your culinary journey today!</p>
        <Button variant="destructive">
            <Link href='/menu'>Browse Menu</Link>
        </Button>
    </div>
);