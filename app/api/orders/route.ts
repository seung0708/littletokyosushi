import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/email-smtp";
import { Database } from "@/types/database.types";

type OrderItemInsert = Partial<Database['public']['Tables']['order_items']['Insert']>;
type OrderItemModifierInsert = Partial<Database['public']['Tables']['order_item_modifiers']['Insert']>;
type OrderItemModifierOptionInsert = Partial<Database['public']['Tables']['order_item_modifier_options']['Insert']>;
 
export async function POST(req: Request) {
    const { customer_id, customer, delivery, total, cartItems, fees } = await req.json();
    //console.log('customer_id', customer_id, 'customer', customer, 'delivery', delivery, 'total', total, 'cartItems', cartItems, 'fees', fees);
    const supabase = await createClient();

    try {
        
        const orderInsert: Partial<Database['public']['Tables']['orders']['Insert']> = {
            customer_id,
            pickup_date: delivery.pickupDate,
            pickup_time: delivery.pickupTime,
            total: total,
            service_fee: fees.serviceFee,
            sub_total: fees.subTotal,
            status: 'not_started'
        };
        
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert(orderInsert)
            .select()
            .single();
        
        console.log('orderData', orderData, 'orderError', orderError);
        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

        for (const item of cartItems)  {
            const orderItemInsert: Partial<Database['public']['Tables']['order_items']['Insert']> = {
                order_id: orderData.id,
                item_id: item.menu_items.id,
                quantity: item.quantity,
                item_name: item.menu_items.name,
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
                for (const modifier of item?.cart_item_modifiers) {
                    const orderItemModifierInsert: OrderItemModifierInsert[] = orderItemData.map((orderItem: OrderItemInsert) => ({
                        order_item_id: orderItem.id,
                        modifier_id: modifier.modifier_id,
                        modifier_name: modifier.modifiers.name,
                    }))

                    const { data: orderItemModifierData, error: orderItemModifierError } = await supabase   
                        .from('order_item_modifiers')
                        .insert(orderItemModifierInsert)
                        .select();
                    
                    if (orderItemModifierError) {
                        return NextResponse.json({ error: orderItemModifierError.message }, { status: 400 });
                    }

                    if(modifier.cart_item_modifier_options) {
                        for (const option of modifier.cart_item_modifier_options) {
                            const orderItemModifierOptionInsert: OrderItemModifierOptionInsert[] = orderItemModifierData.map((orderItemModifier: OrderItemModifierInsert) => ({
                                order_item_modifier_id: orderItemModifier.id,
                                option_id: option.modifier_option_id,
                                option_name: option.modifier_options.name,
                                option_price: option.modifier_options.price
                            }))
                            const { data: orderItemModifierOptionData, error: orderItemModifierOptionError } = await supabase
                                .from('order_item_modifier_options')
                                .insert(orderItemModifierOptionInsert)
                                .select();
                            
                            if (orderItemModifierOptionError) {
                                return NextResponse.json({ error: orderItemModifierOptionError.message }, { status: 400 });
                            }
                        }
                    }
                }
            }            
        }

        const {data: order, error} = await supabase
        .from('orders')
        .select(`*, customers(*), order_items(*, order_item_modifiers(*, order_item_modifier_options(*)))`)
        .eq('short_id', orderData.short_id)
        .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        try {
            await sendOrderConfirmationEmail(order, customer);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}