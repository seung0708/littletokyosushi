import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
    const supabase = createClient();
    console.log('orderId', params.orderId);
    try {
        const {data: orderData, error: orderError} = await supabase
            .from('orders')
            .select('*, order_items(*, order_item_modifiers(*, order_item_modifier_options(*)))')
            .eq('id', params.orderId)
            .single();

        //console.log('orderData', orderData, orderError);
        if (orderError) {
            console.error('Error fetching order data:', orderError);
            return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
        }
        return NextResponse.json({ message: 'Order data fetched successfully', status: 200, orderData: orderData});

    } catch (error) {
        console.error('Error fetching order data:', error); 
        return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
    }
}