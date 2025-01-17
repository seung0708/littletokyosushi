import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { customer_id ,customer, delivery, total, cartItems } = await req.json();
    console.log(customer_id, customer, delivery, total, cartItems);

    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        //console.log(user, userError);

        const { data: customerCart, error: customerError } = await supabase
            .from('carts')
            .select('*')
            .eq('customer_id', user?.id)
            .single();

        //console.log(customerCart)

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: customerCart.customer_id,
                pickup_date: delivery.pickupDate,
                pickup_time: delivery.pickupTime,
                total: total
            })
            .select()
            .single()
        console.log('orderData', orderData, orderError);

        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

        const { data: orderItemsData, error: orderItemsError } = await supabase
            .from('order_items')
            .insert(
                cartItems.map((item: any) => ({
                    order_id: orderData.id,
                    item_id: item.id,
                    quantity: item.quantity,
                    item_name: item.menu_item_name,
                    price: item.price
                }))
            )
            .select()
        console.log('orderItemsData', orderItemsData, orderItemsError);

        if (orderItemsError) {
            return NextResponse.json({ error: orderItemsError.message }, { status: 400 });
        }

        const modifiersExist = cartItems?.some((item: any) => item?.modifiers?.length > 0);
        console.log('modifiersExist', modifiersExist);

        if (modifiersExist) {
            const { data: orderItemModifiersData, error: orderItemModifiersError } = await supabase
                .from('order_item_modifiers')
                .insert(
                    cartItems.map((item: any) => item?.modifiers?.map((modifier: any) => ({
                        order_item_id: item.id,
                        modifier_id: modifier.id,
                    })))
                )
                .select();
            console.log('orderItemModifiersData', orderItemModifiersData, orderItemModifiersError);

            if (orderItemModifiersError) {
                return NextResponse.json({ error: orderItemModifiersError.message }, { status: 400 });
            }

            const modifierOptionsExist = cartItems?.map((item: any) => item?.modifiers)?.map((modifier: any) => modifier?.options)?.filter(Boolean).length > 0;
            console.log('modifierOptionsExist', modifierOptionsExist);

            if (!modifierOptionsExist) {
                return NextResponse.json({ error: 'Modifier options do not exist' }, { status: 400 });
            }

            const { data: orderItemModifierOptionsData, error: orderItemModifierOptionsError } = await supabase
                .from('order_item_modifier_options')
                .insert(
                    cartItems.map((item: any) => item?.modifiers?.map((modifier: any) => modifier?.options?.map((option: any) => ({
                        order_item_modifier_id: option.id,
                        option_id: option.id,
                    }))))
                )

        }

        return NextResponse.json(orderData);

    } catch (error) {
        console.error(error);
    }
}