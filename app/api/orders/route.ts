import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { customer_id ,customer, delivery, total } = await req.json();
    console.log(customer_id, customer, delivery)

    try {
        const supabase = await createClient();

        const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('email', customer.email)
            .single();

        if (customerError) {
            return NextResponse.json({ error: customerError.message }, { status: 400 });
        }

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: customerData.id,
                pickupDate: delivery.pickupDate,
                pickupTime: delivery.pickupTime,
                total: total
            })
            .select('*')
            .single();

        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

    } catch (error) {
        console.error(error);
    }

    return NextResponse.json({ customer, delivery });
}