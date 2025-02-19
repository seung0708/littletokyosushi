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
            .select('*')
            .eq('id', customer_id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching customer:', error);
            return NextResponse.json({ address: null }, { status: 200 });
        }

        // Construct the address object from the customer data
        const address = {
            line1: data.line1 || '',
            line2: data.line2 || '',
            city: data.city || '',
            state: data.state || '',
            postal_code: data.postal_code || '',
            country: data.country || 'US',
            phone: data.phone || ''
        };

        return NextResponse.json({ address: JSON.stringify(address) });
        
    } catch (error) {
        console.error('Error:', error);
        // Return empty data instead of error
        return NextResponse.json({ 
            address: null 
        });
    }
}

export async function PATCH(req: Request) { 
    try {
        const { user, address } = await req.json();
        console.log(user, address)
        //console.log('PATCH /api/customers', { user, address });
        const { line1, line2, city, state, postal_code, country } = address.address;
        const supabase = await createClient();
        if (user.is_anonymous) {
            const { error: updateError } = await supabase
                .from('customers')
                .update(
                    {
                        phone: address.phone.substring(2)
                    }
                )
                .eq('id', user.id)
        
            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 400 });
            }
            
        } else {
            const { data, error } = await supabase
                .from('customers')
                .update({
                line1,
                line2,
                city,
                state,
                postal_code,
                country,
                phone: address.phone.substring(2),
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

        }
        return NextResponse.json('Updated customer');
    } catch (error) {
        console.error('Error updating customer address:', error);
        return NextResponse.json(
            { error: 'Failed to update customer address' },
            { status: 500 }
        );
    }
}