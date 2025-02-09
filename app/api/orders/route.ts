import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/email-smtp";
import { Database } from "@/types/database.types";

type OrderItemInsert = Partial<Database['public']['Tables']['order_items']['Insert']>;
type OrderItemModifierInsert = Partial<Database['public']['Tables']['order_item_modifiers']['Insert']>;
type OrderItemModifierOptionInsert = Partial<Database['public']['Tables']['order_item_modifier_options']['Insert']>;

export async function POST(req: Request) {
    const { customer_id, customer, delivery, total, cartItems, fees } = await req.json();
    const supabase = await createClient();
    console.log('POST /api/orders', { customer_id, customer, delivery, total, cartItems, fees });
    
    try {
        // Validate customer data
        if (!customer.signinEmail && !customer.guestEmail) {
            return NextResponse.json({ error: 'Customer email is required' }, { status: 400 });
        }

        // Handle different customer types
        let finalCustomerId = customer_id;
        console.log('finalCustomerId:', finalCustomerId);
        if (!customer_id) {
            // Guest customer - Check if they already exist
            const { data: existingCustomer, error: customerError } = await supabase
                .from('customers')
                .select('id')
                .eq('email', customer.guestEmail)
                .single();

            if (customerError && customerError.code !== 'PGRST116') {
                console.error('Error checking existing customer:', customerError);
                return NextResponse.json({ error: customerError.message }, { status: 400 });
            }

            if (existingCustomer) {
                // Use existing customer ID
                finalCustomerId = existingCustomer.id;
            } else {
                // Create new guest customer record
                const { data: newCustomer, error: createError } = await supabase
                    .from('customers')
                    .insert({
                        email: customer.guestEmail,
                        first_name: customer.guestName.split(' ')[0],
                        last_name: customer.guestName.split(' ')[1] || '',
                        phone: customer.phone,
                        is_guest: true
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating guest customer:', createError);
                    return NextResponse.json({ error: createError.message }, { status: 400 });
                }

                finalCustomerId = newCustomer.id;
            }
        }

        // Create the order
        const orderInsert: Partial<Database['public']['Tables']['orders']['Insert']> = {
            customer_id: finalCustomerId,
            pickup_date: delivery.pickupDate,
            pickup_time: delivery.pickupTime,
            total: total,
            service_fee: fees.serviceFee,
            sub_total: fees.subTotal,
            status: 'pending'
        };

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert(orderInsert)
            .select()
            .single();
    
        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

        // Process order items
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
                            const { error: orderItemModifierOptionError } = await supabase
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

        // Send confirmation email
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