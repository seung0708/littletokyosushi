import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";

type OrderItemInsert = Partial<Database['public']['Tables']['order_items']['Insert']>;
type OrderItemModifierInsert = Partial<Database['public']['Tables']['order_item_modifiers']['Insert']>;

 
export async function POST(req: Request) {
    const { customer, delivery, total, cartItems, fees, status } = await req.json();
    
    const supabase = await createClient();

    try {
        
        const orderInsert: Partial<Database['public']['Tables']['orders']['Insert']> = {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,  
            pickup_at: customer.pickupAt,
            total: total,
            sub_total: fees.subTotal,
            status: status
        };
        
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert(orderInsert)
            .select()
            .single();
        
        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

        for (const item of cartItems)  {
            const orderItemInsert: Partial<Database['public']['Tables']['order_items']['Insert']> = {
                order_id: orderData.id,
                item_id: item.menu_items.id,
                quantity: item.quantity,
                price: item.base_price
            }

            const { data: orderItemData, error: orderItemError } = await supabase
                .from('order_items')
                .insert(orderItemInsert)
                .select()

            
            if (orderItemError) {
                return NextResponse.json({ error: orderItemError.message }, { status: 400 });
            }

            if(item?.cart_item_modifiers) {
                const orderItemModifierInsert = item.cart_item_modifiers.map((modifier: any) => ({
                    order_item_id: orderItemData[0].id,
                    modifier_option_id: modifier.modifier_option_id,
                    price: modifier.price ?? 0
                }))

                const { error: orderItemModifierError } = await supabase   
                    .from('order_item_modifiers')
                    .insert(orderItemModifierInsert)
    
                if (orderItemModifierError) {
                    return NextResponse.json({ error: orderItemModifierError.message }, { status: 400 });
                }       
            }           
        }

        // Get full order data with relationships
        const {data: order, error} = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    order_item_modifiers (
                        *,
                    )
                )
            `)
            .eq('id', orderData.id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}