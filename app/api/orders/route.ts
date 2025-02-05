import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/email-smtp";

export async function POST(req: Request) {
    const { customer_id, customer, delivery, total, cartItems, fees } = await req.json();
    
    try {
        const supabase = await createClient();

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: customer_id,
                pickup_date: delivery.pickupDate,
                pickup_time: delivery.pickupTime,
                total: total,
                service_fee: fees.serviceFee,
                sub_total: fees.subTotal
            })
            .select()
            .single();
    
        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

        const { data: orderItemsData, error: orderItemsError } = await supabase
            .from('order_items')
            .insert(
                cartItems.map((item: any) => ({
                    order_id: orderData.id,
                    item_id: item.menu_item_id,
                    quantity: item.quantity,
                    item_name: item.menu_item_name,
                    price: item.menu_item_price
                }))
            )
            .select();

        if (orderItemsError) {
            return NextResponse.json({ error: orderItemsError.message }, { status: 400 });
        }

        const modifiersExist = cartItems?.some((item: any) => item?.cart_item_modifiers?.length > 0);

        if (modifiersExist) {
            const { data: orderItemModifiersData, error: orderItemModifiersError } = await supabase
                .from('order_item_modifiers')
                .insert(
                    cartItems.flatMap((item: any, index: number) => 
                        (item?.cart_item_modifiers || []).map((modifier: any, modifierIndex: number) => ({
                            order_item_id: orderItemsData[index].id,
                            modifier_id: modifier.modifier_id,
                            modifier_name: modifier.name,
                        }))
                    )
                )
                .select();

            if (orderItemModifiersError) {
                return NextResponse.json({ error: orderItemModifiersError.message }, { status: 400 });
            }

            const modifierOptionsExist = cartItems?.some((item: any) => item?.cart_item_modifiers?.some((modifier: any) => modifier?.cart_item_modifier_options?.length > 0));

            if (!modifierOptionsExist) {
                return NextResponse.json({ error: 'Modifier options do not exist' }, { status: 400 });
            }

            // Create a mapping using both order_item_id and modifier_id
            const modifierMapping = {};
            orderItemModifiersData.forEach((orderMod) => {
                const key = `${orderMod.order_item_id}_${orderMod.modifier_id}`;
                modifierMapping[key] = orderMod.id;
            });

            // Then use the mapping with order item ID
            const { data: orderItemModifierOptionsData, error: orderItemModifierOptionsError } = await supabase
                .from('order_item_modifier_options')
                .insert(
                    cartItems.flatMap((item: any, index: number) => 
                        item?.cart_item_modifiers?.flatMap((modifier: any) => {
                            // Get the corresponding order item ID for this cart item
                            const orderItemId = orderItemsData[index].id;
                            const key = `${orderItemId}_${modifier.modifier_id}`;
                            
                            return modifier?.cart_item_modifier_options?.map((option: any) => ({
                                order_item_modifier_id: modifierMapping[key],
                                option_id: option.modifier_option_id,
                                option_name: option.name,
                                option_price: option.price
                            }));
                        })
                    )
                )
                .select();

            if (orderItemModifierOptionsError) {
                return NextResponse.json({ error: orderItemModifierOptionsError.message }, { status: 400 });
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