import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
    const supabase = createClient();
    console.log('orderId', params.orderId);
    try {
        const {data: orderData, error: orderError} = await supabase
            .from('orders')
            .select(`*, order_items(*, order_item_modifiers(*, order_item_modifier_options(*)))`)
            .eq('id', params.orderId)
            .single();

        console.log('Raw order data:', JSON.stringify(orderData, null, 2));
        
        if (orderError) {
            console.error('Error fetching order data:', orderError);
            return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
        }

        if (!orderData) {
            console.error('No order data found for ID:', params.orderId);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order data fetched successfully', status: 200, orderData: orderData});

    } catch (error) {
        console.error('Error in GET /api/orders/[orderId]:', error); 
        return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
    }
}