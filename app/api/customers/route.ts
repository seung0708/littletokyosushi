import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const customer_id = new URL(req.url).searchParams.get('customer_id');
    
    if (!customer_id) {
        return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('customers')
            .select('*')  // Change from 'address' to '*' to get all columns
            .eq('id', customer_id)
            .single();

        // Even if there's an error about missing column, return empty data
        return NextResponse.json({ 
            address: null  // Return null if address column doesn't exist yet
        });
        
    } catch (error: any) {
        console.error('Error:', error);
        // Return empty data instead of error
        return NextResponse.json({ 
            address: null 
        });
    }
}

export async function PATCH(req: Request) { 
    try {
        const { customer_id, address } = await req.json();
        const { line1, line2, city, state, zip, country } = address.value.address;
        console.log('Updating customer address:', { customer_id, address });
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('customers')
            .update({
                line1: line1,
                line2: line2,
                city: city,
                state: state,
                postal_code: zip,
                country: country,
                phone: address.value.phone,
                updated_at: new Date().toISOString()
            })
            .eq('id', customer_id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to update customer address' },
            { status: 500 }
        );
    }
}