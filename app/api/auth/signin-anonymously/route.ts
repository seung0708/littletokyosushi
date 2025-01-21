import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    )
    const serverSupabase = createServerClient(); 
    const { email, name } = await req.json()
    const first_name = name.split(' ')[0]
    const last_name = name.split(' ')[1]

    try {

        const {data: customer, error: customerError} = await supabase
            .from('customers')
            .select('*')
            .eq('email', email)
            .single()
        console.log('customer',customer)

        if (customer) {
            const { data: {user: existingUser}, error: usersError} = await supabase.auth.admin.getUserById(customer.id);
            console.log('existingUser',existingUser)
            if(existingUser && !existingUser.is_anonymous) { 
                return NextResponse.json(
                    { error: "An account with this email already exists. Please sign in instead." }, 
                    { status: 400 }
                );
            }
            if (existingUser) {
                const { data, error: signInError } = await serverSupabase.auth.signInWithPassword({
                    email: email, 
                    password: process.env.GUEST_DEFAULT_PASSWORD!
                }) 

                if (!data.user) {
                    const { error: updateError } = await supabase.auth.admin.updateUserById(
                            existingUser.id, {
                            email: email,
                            password: process.env.GUEST_DEFAULT_PASSWORD!,
                        }
                    );
                    const { data: confirmData, error: confirmError } = await supabase
                        .rpc('confirm_email_on_update', {
                            user_id: existingUser.id
                        });
                    console.log('confirm result:', confirmData, confirmError);

                    const { data, error: retrySignInError } = await serverSupabase.auth.signInWithPassword({
                        email: email, 
                        password: process.env.GUEST_DEFAULT_PASSWORD!
                    })

                    return NextResponse.json(data, { status: 200 })
                }

                return NextResponse.json(data, { status: 200 })
            }
        }

        if (!customer) {
            const { data: { user }, error } = await serverSupabase.auth.signInAnonymously(
                {
                    options: {
                        data: {
                            email: email,
                            first_name: first_name,
                            last_name: last_name
                        }
                    }
             })
             console.log('user',user)
             if (error) {
                 console.error('Error signing in anonymously:', error);
                 return NextResponse.json({ error: error.message }, { status: 400 })
             }
     
             if (!user) {
                 return NextResponse.json({ error: 'No user created' }, { status: 400 })
             }
     
             const { data: customerData, error: customerError } = await supabase
                 .from('customers')
                 .insert({
                     id: user.id,
                     email: email,
                     first_name: first_name,
                     last_name: last_name
                 })
                 .select()
                 .single()

             if (customerError) {
                console.error('Error creating customer:', customerError);
                return NextResponse.json({ error: customerError.message }, { status: 400 })
             }
     
             // Return user with customer data
            return NextResponse.json({
               user
            })
        }
        
    } catch (error) {
        console.error('Error signing in anonymously:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}