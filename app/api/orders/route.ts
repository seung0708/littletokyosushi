import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/email-smtp";
import { Database } from "@/types/database.types";

type OrderItemModifierInsert = Partial<Database['public']['Tables']['order_item_modifiers']['Insert']>;
type OrderItemModifierOptionInsert = Partial<Database['public']['Tables']['order_item_modifier_options']['Insert']>;

export async function POST(req: Request) {
    const { customer_id, customer, delivery, total, cartItems, fees } = await req.json();
    const supabase = await createClient();

    try {
        
        const orderInsert: Partial<Database['public']['Tables']['orders']['Insert']> = {
            customer_id: customer_id,
            pickup_date: delivery.pickupDate,
            pickup_time: delivery.pickupTime,
            total: total,
            service_fee: fees.serviceFee,
            sub_total: fees.subTotal
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
                item_id: item.menu_item_id,
                quantity: item.quantity,
                item_name: item.menu_item_name,
                price: item.menu_item_price
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
                    const orderItemModifierInsert: OrderItemModifierInsert[] = orderItemData.map((orderItem: any) => ({
                        order_item_id: orderItem.id,
                        modifier_id: modifier.modifier_id,
                        modifier_name: modifier.name,
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
                            const orderItemModifierOptionInsert: OrderItemModifierOptionInsert[] = orderItemModifierData.map((orderItemModifier: any) => ({
                                order_item_modifier_id: orderItemModifier.id,
                                option_id: option.modifier_option_id,
                                option_name: option.name,
                                option_price: option.price
                            }))
                            const { data: orderItemModifierOptionData, error: orderItemModifierOptionError } = await supabase
                                .from('order_item_modifier_options')
                                .insert(orderItemModifierOptionInsert)
                            
                            if (orderItemModifierOptionError) {
                                return NextResponse.json({ error: orderItemModifierOptionError.message }, { status: 400 });
                            }
                        }
                    }
                }
            }
        }

        // Send confirmation email directly
        try {
            await sendOrderConfirmationEmail(
                {
                    ...orderData,
                    items: cartItems
                },
                customer
            );
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't return error here as the order was still created successfully
        }

        return NextResponse.json(orderData);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}